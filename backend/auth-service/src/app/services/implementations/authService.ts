import { UserRepository } from "../../repositories/implements/userRepository";
import { RegisterUserDTO } from "../../dtos/registerUserDTO";
import { hashPassword, comparePassword } from "../../../utils/hashUtils";
import { generateOTP } from "../../../utils/otpUtils";
import { RabbitMQConfig } from "../../../config/rabbitmq";
import { publishToQueue } from "../../../queues/publisher";
import { publishToQueueWithRPCAndRetry } from "../../../queues/publisherWithRPCAndRetry";
import { UserRoles } from "../../types/roles";
import { v4 as uuidv4 } from "uuid";
import { OAuth2Client } from "google-auth-library";
import { config } from "../../../config";
import { Messages } from "../../../constants/messageConstants";
import { HttpStatus } from "../../../constants/httpStatus";
import { UserData } from "../../middlewares/extractUserData";
import { deleteRedisData, getRedisData, setRedisData } from "../../../utils/redisUtils";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwtUtils";
import { basicResponse } from "../../interfaces/basicResponse";
import { nanoid } from "nanoid";
import { generatesubscriptionEndDate } from "../../../utils/dateUtilFunctions";
import { IUser } from "../../models/interface/IUser";
import {
  IActiveUserResponse,
  IAuthService,
  IChangePassData,
  IGenerateUserTokenResponse,
  IGetUserRoleResponse,
  IGoogleTokenResponse,
  IUpdateOneDocResp,
} from "../../services/interface/IAuthService";


/**
 * @class AuthService
 * @description Implements the core business logic for authentication and user management.
 * Acts as an intermediary between controllers and data access layers.
 * @implements {IAuthService} mplements the IAuthService interface to ensure consistent behavior
 * @param {UserRepository} userRepository - Handles database operations related to users.
 */

export class AuthService implements IAuthService {
  constructor(private userRepository: UserRepository) {}



  //==================================== USER REGISTRATION METHOD ======================================================

  async registerUser(
    data: RegisterUserDTO
  ): Promise<basicResponse> {

      const {
        email,
        password,
        companyName,
        companyType,
        phoneNumber,
        corporatedId,
        originCountry,
      } = data;

      //check if user already exists in Redis
      const isEmailVerified = await getRedisData(`tempEmail:${email}`);
      if (!isEmailVerified) {
        return {
          message: Messages.VERIFIED_EMAIL_ERR,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

      //check if user already exists in DB
      const exists = await this.userRepository.findUserByEmail(email as string);
      if (exists)
        return {
          message: Messages.USER_EXIST,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };

      const hashedPassword = await hashPassword(password);
      //Generate a UUID V4
      const authUserUUID = uuidv4();
      // get subscriptionEndDate
      const subscriptionEndDate = generatesubscriptionEndDate();
      //store user data in auth-service db.
      const role = UserRoles.Company;
      const storeUser = await this.userRepository.create(
        email,
        hashedPassword,
        role,
        authUserUUID,
        subscriptionEndDate
      );

      //company data payload for sending to company service
      const companyData = {
        authUserUUID: storeUser.authUserUUID,
        email,
        companyName,
        companyType,
        phoneNumber,
        corporatedId,
        originCountry,
        role,
        subscriptionEndDate: generatesubscriptionEndDate(),
      };

      //delete user data from reddis
      await deleteRedisData(`tempEmail:${email}`);

      /**
       * sending data to company-service to store in DB.
       * @param queueName
       * @param sendingData
       * @param retry_count
       */
      const response = await publishToQueueWithRPCAndRetry(
        RabbitMQConfig.companyRPCQueue,
        companyData,
        3
      );

      if (response.success) {
        return {
          message: Messages.REGISTER_SUCCESS,
          success: true,
          statusCode: HttpStatus.CREATED,
        };
      } else {
        // Rollback the operation from the auth service
        await this.userRepository.deleteById(storeUser._id as string);
        return {
          message: Messages.OPERATION_ROLLBACKED,
          success: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
  }

  //==================================== VERIFY OTP METHOD ======================================================

  async verifyOTP(email: string, otp: string): Promise<basicResponse> {

      // Check if email and OTP are provided
      if (!email || !otp) {
        return {
            message: Messages.EMAIL_AND_OTP,
            success: false,
            statusCode:HttpStatus.BAD_REQUEST
           };
      }

      // Check if user exists in Redis
      const existingTempUser = await getRedisData(`verifyEmail:${email}`);
      if (!existingTempUser) {
        return {
           message: Messages.USER_NOT_FOUND,
           success: false,
           statusCode : HttpStatus.BAD_REQUEST
           };
      }

      // Check if user already verified data exists in Redis
      const existingTempEmail = await getRedisData(`tempEmail:${email}`);
      if (existingTempEmail) {
        return {
            message: Messages.OTP_VERIFIED,
            success: true,
            statusCode : HttpStatus.BAD_REQUEST
           };
      }

      // Compare the provided OTP with the OTP stored in Redis
      if (existingTempUser.otp !== otp) {
        return { 
           message: Messages.INCORRECT_OTP,
           success: false,
           statusCode : HttpStatus.BAD_REQUEST
           };
      }

      // Store user email in reddis and delete verifyemail data from reddis
      await Promise.all([
        setRedisData(`tempEmail:${email}`, email, 1200),
        deleteRedisData(`verifyEmail:${email}`),
      ]);
      // if success
      return {
         message: Messages.OTP_VERIFIED,
         success: true,
         statusCode : HttpStatus.OK
         };
  }

  //================================================ *VERIFY LOGIN* ===================================================

  async verifyLogin(
    email: string,
    password: string
  ): Promise<{
    message: string;
    success: boolean;
    statusCode : number;
    role?: string;
    tockens?: { refreshToken: string; accessToken: string };
    isFirst?: boolean;
  }> {


      // Check if email and password are provided
      if (!email || !password) {
        return { 
           message: Messages.ALL_FILED_REQUIRED_ERR,
           success: false,
           statusCode : HttpStatus.BAD_REQUEST
           };
      }

      // Find the user in the database
      const findUser = await this.userRepository.findUserByEmail(email);
      if (!findUser) {
        return {
            message: Messages.USER_NOT_FOUND,
            success: false,
            statusCode : HttpStatus.BAD_REQUEST
           };
      }

      if (findUser.isBlock) {
        return {
            message: Messages.USER_BLOCKED,
            success: false,
            statusCode : HttpStatus.BAD_REQUEST
           };
      }

      // Compare the provided password with the hashed password stored in the database
      const isMatch = await comparePassword(password, findUser.password);
      if (!isMatch) {
        return { 
           message: Messages.INVALID_CREDENTIALS,
           success: false,
           statusCode : HttpStatus.BAD_REQUEST
           };
      }

      // payload for creating tokens
      const payload = {
        authUserUUID: findUser.authUserUUID,
        email: findUser.email,
        role: findUser.role,
      };
      // Generate access and refresh tokens
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      /**
       * for employees sending one time password through email after registration
       * If the employee login for first time update the DB field true
       * so the employee need to reset password after first login
       */
      if (findUser.isFirstLogin === true) {
        return {
          message: Messages.FIRST_LOGIN_SUCCESS,
          success: true,
          statusCode : HttpStatus.OK,
          tockens: { accessToken, refreshToken },
          isFirst: true,
        };
      }
      // if its regular login
      return {
        message: "Login Successfull",
        success: true,
        statusCode : HttpStatus.OK,
        tockens: { accessToken, refreshToken },
        role: findUser.role as string,
      };

  }

  // ========================================== *VERIFY EMAIL METHOD* ========================================================

  async verifyEmail(email: string): Promise<basicResponse> {
  
      // Check if email already exists in Redis
      const existingTempUser = await getRedisData(`verifyEmail:${email}`);
      if (existingTempUser) {
        return {
          message: Messages.REGISTRATION_IN_PROGRESS,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST
        };
      }

      // Check if user already exists in the database
      const existsUser = await this.userRepository.findUserByEmail(email as string);
      if (existsUser) {
        return {
            message: Messages.USER_EXIST,
            success: false,
            statusCode : HttpStatus.BAD_REQUEST
            };
      }

      // Generate OTP for email validation
      const OTP = generateOTP();

      // Store email id in Redis for 4 minutes
      await setRedisData(`verifyEmail:${email}`, { otp: OTP, email }, 240);

      // Send OTP and user data to notification queue using RabbitMQ
      const notificationPayload = {
        email,
        type: "registration",
        otp: OTP,
        subject: `OTP for Registration`,
        message: `Hi , your OTP for registration is ${OTP}`,
        template: "otpTemplate",
      };

      // Send notification to notification service using RabbitMQ
      await publishToQueue(RabbitMQConfig.notificationQueue, notificationPayload);
      return {
          message: Messages.OTP_SENDED,
          success: true,
          statusCode : HttpStatus.OK
         };
  }

  //===================================== UPDATE PASSWORD ======================================================

  async updateUserPassword(
    email: string,
    password: string
  ): Promise<basicResponse> {

      // Check if user exists in the database
      const userExist = await this.userRepository.findUserByEmail(email);
      if (!userExist) {
        return { 
           message: Messages.USER_NOT_FOUND,
           success: false,
           statusCode : HttpStatus.BAD_REQUEST
           };
      }

      // Hash the new password
      const hashedPassword = await hashPassword(password);
      // Update the user's password in the database
      const updatePassword = await this.userRepository.resetPassword(email, hashedPassword);

      // Check if password update was successful or not
      if (!updatePassword) {
        return {
          message : Messages.UPDATE_PASS_FAILED,
          success : false,
          statusCode: HttpStatus.BAD_REQUEST
        };
      }
      // Return success message
      return {
        message: Messages.UPDATE_PASS_SUCCESS,
        success: true,
        statusCode : HttpStatus.OK
      };

  }

  // ============================== GET USER ROLE ================================================================

  async getUserRole(email: string): Promise<IGetUserRoleResponse> {

      const userRole = await this.userRepository.findUserByEmail(email);

      if (!userRole) {
        return { 
           message: Messages.USER_NOT_FOUND,
           success: false,
           statusCode : HttpStatus.BAD_REQUEST
          };
      }
      // if user data found!
      return {
        message: Messages.OK,
        success: true,
        role: userRole.role,
        statusCode : HttpStatus.OK
      };
  }

  //==================================== Google token verification and extraction  ==============================

  async extractGoogleToken(token: string): Promise<IGoogleTokenResponse> {
    // Verify the token with the Google OAuth2 client
    const CLIENT_ID = config.OAuthClientId;
    const client = new OAuth2Client(CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    // Get the payload from the verified token
    const payload = ticket.getPayload();
    if (!payload) {
      return {
        message: Messages.PAYLOAD_NOT_FOUND,
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    // Extract the user's email from the payload
    const email = payload.email;
    return { statusCode: HttpStatus.OK, message: Messages.OK, success: true, email };
  }
  //================================= CHECKING FOR USER IS EXIST AND IN ACTIVE STATE ==========================

  async checkIsActiveUser(email: string): Promise<IActiveUserResponse> {
    const isUserExist = await this.userRepository.findUserByEmail(email);
    //checking for user exist or not!
    if (!isUserExist) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: Messages.USER_NOT_FOUND,
        success: false,
        userData: null,
      };
    }
    //checking for user blocked or not!
    if (isUserExist.isBlock) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: Messages.USER_BLOCKED,
        success: false,
        userData: null,
        isBlock: true,
      };
    }
    //Is user is active then send response
    return {
      statusCode: HttpStatus.OK,
      message: Messages.OK,
      success: true,
      userData: isUserExist,
    };
  }

  //======================= To generate access tocken and refresh token for the user  ======================
  
  async generateUserToken(userData: IUser): Promise<IGenerateUserTokenResponse> {
    const userPayload = {
      authUserUUID: userData.authUserUUID,
      email: userData.email,
      role: userData.role,
    };

    //generating tokens
    const [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(userPayload),
      generateRefreshToken(userPayload),
    ]);
    return {
      statusCode: HttpStatus.OK,
      message: Messages.LOGIN_SUCCESS,
      success: true,
      accessToken,
      refreshToken,
    };
  }

  //========================================== GET RESEND OTP  ===================================================

  async getResendOTP(email: string): Promise<basicResponse> {
  
      //verifying email with redis data 
      const verifyEmail = await getRedisData(`verifyEmail:${email}`);
      if (!verifyEmail) {
        return {
            message: Messages.USER_NOT_FOUND,
            success: false,
            statusCode : HttpStatus.BAD_REQUEST
          };
      }
      //delete stored email
      await deleteRedisData(`verifyEmail:${email}`);
      const otp = generateOTP();
      // Store verified email and otp in Redis DB either login proccess complete or 4 min
      await setRedisData(`verifyEmail:${email}`, { otp, email }, 240);
      // Payload for sending OTP to notification service
      const notificationPayload = {
        email,
        type: "registration",
        otp,
        subject: `OTP for Registration`,
        message: `Hi , your OTP for registration is ${otp}`,
        template: "otpTemplate",
      };

      /**
       * sending data to notification queuw
       * @param queueName
       * @param registraction_data for send
       */
      await publishToQueue(RabbitMQConfig.notificationQueue, notificationPayload);
      // after success
      return {
        message: Messages.OTP_RESENT,
        success: true,
        statusCode : HttpStatus.OK
        };
  }

  //=========================== SUPER ADMIN LOGIN VERIFICATION ======================================================

  async verifySuperAdminLogin(
    email: string,
    password: string
  ): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
    tockens?: { accessToken: string; refreshToken: string };
    role?: string;
  }> {

      // check for user existing
      const findUser = await this.userRepository.findUserByEmail(email);
      if (!findUser) {
        return {
          message: Messages.USER_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
      // verifying  user email in DB with admin email in configs for double checking!
      if (findUser.email !== config.superAdminEmail) {
        return {
          message: Messages.NO_ACCESS,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

      const passwordMatch = await comparePassword(password, findUser.password);
      if (!passwordMatch) {
        return {
          message: Messages.INVALID_CREDENTIALS,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
      // payload for creating tokens
      const payload = {
        authUserUUID: findUser.authUserUUID,
        email: findUser.email,
        role: findUser.role,
      };
      // generate tokens with payload data
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);
      // if success
      return {
        message: Messages.LOGIN_SUCCESS,
        statusCode: HttpStatus.OK,
        success: true,
        tockens: { accessToken, refreshToken },
        role: findUser.role,
      };
   
  }

  //==================================== VERIFY USER METHOD ========================================================

  async verifyUser(email: string): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
    accessToken?: string;
  }> {
      // Getting user data
      const getUser = await this.userRepository.findUserByEmail(email);
      if (!getUser) {
        return {
          message: Messages.USER_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
      // if user is blocked!
      if (getUser.isBlock) {
        return {
          message: Messages.USER_BLOCKED,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
      // payload for creating token
      const payload: UserData = {
        authUserUUID: getUser.authUserUUID,
        email: getUser.email,
        role: getUser.role,
      };
      // generating access token with payload
      const accessToken = await generateAccessToken(payload);

      return {
        message: Messages.OK,
        statusCode: HttpStatus.OK,
        success: true,
        accessToken,
      };
  }

//==================================== UPDATE USER BLOCK STATUS ========================================================


  async updateUserBlockStatus(
    email: string
  ): Promise<{ message: string; success: boolean; statusCode: number; userDataPayload?: object }> {

    // Get the user detailas
      const findUser = await this.userRepository.findUserByEmail(email);
      if (!findUser) {
        return {
          message: Messages.USER_NOT_FOUND,
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
        };
      }
      // for updating user block status :- for that tacking current opposite status
      const getStatus: boolean = !findUser.isBlock;
      // delegating to repository layer for updatin the data in db.
      const updateUser = await this.userRepository.blockAndUnblockUserWithEmail(email, getStatus);
      // if data not updated!
      if (!updateUser) {
        return {
          message: Messages.USER_UPDATE_FAILED,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
      // user data payload for sending as response
      const userDataPayload = {
        email: updateUser.email,
        isBlock: updateUser.isBlock,
      };

      //store the email id blacklist user in reddis
      const key = `blacklist:user:${email}`;
      // if user is blocked true , then black listing the user
      if (updateUser.isBlock) {
        await setRedisData(key, { blacklisted: true }, 1800); // 30 min
      } else {
      // if the user unblocked delete user from black listing
        await deleteRedisData(key);
      }
      // if success
      return {
        message: Messages.USER_UPDATE_SUCCESS,
        statusCode: HttpStatus.OK,
        success: true,
        userDataPayload,
      };
  }

  //==================================== FORGOT PASSWORD HANDLE ========================================================

  async validateForgotPasswordReq(email: string): Promise<basicResponse> {

    //Get user data
    const userIsExist = await this.userRepository.findUserByEmail(email);
    if (!userIsExist) {
      return {
        message: Messages.USER_NOT_FOUND,
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    //create a token using nano module
    const token = nanoid();
    //storing user email with token in Reddis for verification purposes
    const storeData = await setRedisData(token, userIsExist.email, 300);
    // if failed to store on reddis
    if (storeData !== "OK") {
      return {
        message: Messages.SERVER_ERROR,
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
    // payload for sending forgot password email from notification service
    const notificationPayload = {
      email: userIsExist.email,
      type: "change-password-link",
      resetLink: `${config.resetPasswordUrlLink}?token=${token}`,
      subject: `Reset Password link`,
      template: `resetPasswordTemplate`,
    };

    //send to notification queue with payload data
    await publishToQueue(RabbitMQConfig.notificationQueue, notificationPayload);
    //if it success
    return {
      message: Messages.FORGOT_PASS_LINK,
      success: true,
      statusCode: HttpStatus.OK,
    };
  }

//==================================== RESET PASSWORD HANDLE ========================================================

  async handleResetPassword(token: string, password: string): Promise<basicResponse> {

    //fetching data from reddis that stored on the time of verification
    const getEmail = await getRedisData(token);
    // if email not found in reddis DB.
    if (!getEmail) {
      return {
        message: Messages.TOKEN_EXPIRED,
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    //get hashed password
    const getHashPassword = await hashPassword(password);
    // Delegating to the repository layer for update password
    const updateUser = await this.userRepository.updatePasswordByEmail(getEmail, getHashPassword);

    // if updated successfully
    if (updateUser) {
      return { 
         message: Messages.PASSWORD_UPDATED,
         statusCode: HttpStatus.OK,
         success: true };
    } else {
    // if updating password failed
      return {
        message: Messages.SERVER_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
      };
    }
  }

//==================================== CHANGE PASSWORD HANDLE ========================================================

  async changePasswordService(data: IChangePassData): Promise<basicResponse> {

    const { currentPassword, email, newPassword } = data;
    // check user is existing
    const isExist = await this.userRepository.findUserByEmail(email);
    if (!isExist) {
      return {
        message: Messages.USER_NOT_FOUND,
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
      };
    }

    // verifying both password are matching
    const passwordMatch = await comparePassword(currentPassword, isExist.password);
    // if its doesn't matching
    if (!passwordMatch) {
      return {
        message: Messages.PASSWORD_NOT_MATCHING,
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    const getHashedPassword = await hashPassword(newPassword);
    // delegating to the repository layer for updating the password
    const updatePassword = await this.userRepository.changePasswordRepo(
      { email: email },
      { password: getHashedPassword }
    );
    // if updation failed
    if (!updatePassword) {
      return {
        message: Messages.SOMETHING_WENT_WRONG,
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    // if its success
    return {
      message: Messages.PASSWORD_UPDATED,
      statusCode: HttpStatus.OK,
      success: true,
    };
  }

//==================================== UPDATING ONE DOCUMENT ========================================================

  //updae one doucment
  async updateDocumentService(
    searchQuery: Record<string, any>,
    updateQuery: Record<string, any>
  ): Promise<IUpdateOneDocResp> {
    const response = await this.userRepository.updateOneDocument(searchQuery, updateQuery);
    if (!response) {
      return {
        message: Messages.DATA_NOT_FOUND,
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    return {
      message: Messages.USER_UPDATE_SUCCESS,
      statusCode: HttpStatus.OK,
      success: true,
      data: response,
    };
  }
}
