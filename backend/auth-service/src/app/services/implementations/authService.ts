import { UserRepository } from "../../repositories/implements/userRepository";
import { RegisterUserDTO } from "../../dtos/registerUserDTO";
import { IAuthService } from "../../services/interface/IAuthService";
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

export class AuthService implements IAuthService {
  constructor(private userRepository: UserRepository) {}

  // user registraction ===================================================================================================

  async registerUser(data: RegisterUserDTO): Promise<{ message: string; success: boolean; statusCode: number }> {
    try {
      const { email, password, companyName, companyType, phoneNumber, corporatedId, originCountry } = data;

      //check if email and password and other details are provided
      if (!email || !password || !companyName || !companyType || !phoneNumber || !corporatedId || !originCountry) {
        return {
          message: Messages.ALL_FILED_REQUIRED_ERR,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

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
      const exists = await this.userRepository.findByEmail(email as string);
      if (exists)
        return {
          message: Messages.USER_EXIST,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };

      //hash password
      const hashedPassword = await hashPassword(password);

      //Generate a UUID V4
      const authUserUUID = uuidv4();

      //store user data in auth-service db.
      const role = UserRoles.Company;
      const storeUser = await this.userRepository.create(email, hashedPassword, role, authUserUUID);
      if (!storeUser) {
        return {
          message: Messages.FAIL_TRY_AGAIN,
          success: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }

      const companyData = {
        authUserUUID: storeUser.authUserUUID,
        email,
        companyName,
        companyType,
        phoneNumber,
        corporatedId,
        originCountry,
        role,
      };

      //delete user data from reddis
      await deleteRedisData(`tempEmail:${email}`);

      //sending data to company-service to store in DB.
      const response = await publishToQueueWithRPCAndRetry(RabbitMQConfig.companyRPCQueue, companyData, 3);

      if (response.success) {
        return {
          message: Messages.REGISTER_SUCCESS,
          success: true,
          statusCode: HttpStatus.CREATED,
        };
      } else {
        await this.userRepository.deleteById(storeUser._id as string);
        return {
          message: "Failed to save data in CS DB, user data rollbacked ",
          success: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    } catch (error) {
      return {
        message: String(error),
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  //=====================================================================================================================

  async verifyOTP(email: string, otp: string): Promise<{ message: string; success: boolean }> {
    try {
      // Check if email and OTP are provided
      if (!email || !otp) {
        return { message: Messages.EMAIL_AND_OTP, success: false };
      }

      // Check if user exists in Redis
      const existingTempUser = await getRedisData(`verifyEmail:${email}`);
      if (!existingTempUser) {
        return { message: Messages.USER_NOT_FOUND, success: false };
      }

      // Check if user already verified data exists in Redis
      const existingTempEmail = await getRedisData(`tempEmail:${email}`);
      if (existingTempEmail) {
        return { message: Messages.OTP_VERIFIED, success: true };
      }

      // Compare the provided OTP with the OTP stored in Redis
      if (existingTempUser.otp !== otp) {
        return { message: Messages.INCORRECT_OTP, success: false };
      }

      // Store user email in reddis and delete verifyemail data from reddis
      await Promise.all([setRedisData(`tempEmail:${email}`, email, 1200), deleteRedisData(`verifyEmail:${email}`)]);

      return { message: Messages.OTP_VERIFIED, success: true };
    } catch (error) {
      return { message: String(error), success: false };
    }
  }

  //====================================================================================================================

  async verifyLogin(
    email: string,
    password: string
  ): Promise<{
    message: string;
    success: boolean;
    role?: string;
    tockens?: { refreshToken: string; accessToken: string };
    isFirst?: boolean;
  }> {
    try {
      // Check if email and password are provided
      if (!email || !password) {
        return { message: "please provide email and password", success: false };
      }

      // Find the user in the database
      const findUser = await this.userRepository.findByEmail(email);
      if (!findUser) {
        return { message: "User not found", success: false };
      }

      if (findUser.isBlock) {
        return { message: Messages.USER_BLOCKED, success: false };
      }

      // Compare the provided password with the hashed password stored in the database
      const isMatch = await comparePassword(password, findUser.password);
      if (!isMatch) {
        return { message: "Invalid Credentials", success: false };
      }

      // Generate access and refresh tokens
      const payload = {
        authUserUUID: findUser.authUserUUID,
        email: findUser.email,
        role: findUser.role,
      };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      if (findUser.isFirstLogin === true) {
        return {
          message: "Login successfull. Reset your password and continue !",
          success: true,
          tockens: { accessToken, refreshToken },
          isFirst: true,
        };
      }

      return {
        message: "Login Successfull",
        success: true,
        tockens: { accessToken, refreshToken },
        role: findUser.role as string,
      };
    } catch (error) {
      return { message: String(error), success: false };
    }
  }

  // verify email =====================================================================================================

  async verifyEmail(email: string): Promise<{ message: string; success: boolean }> {
    try {
      // Check if email is provided
      if (!email) {
        return { message: "Please provide email", success: false };
      }

      // Check if email already exists in Redis
      const existingTempUser = await getRedisData(`verifyEmail:${email}`);
      if (existingTempUser) {
        return {
          message: "User registration already in progress",
          success: false,
        };
      }

      // Check if user already exists in the database
      const existsUser = await this.userRepository.findByEmail(email as string);
      if (existsUser) {
        return { message: "User with email id already exist", success: false };
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

      return { message: "Kindly check your email for OTP ", success: true };
    } catch (error) {
      return { message: String(error), success: false };
    }
  }

  //password updation ===========================================================================================

  async updateUserPassword(email: string, password: string): Promise<{ message: string; success: boolean }> {
    try {
      // Check if user exists in the database
      const userExist = await this.userRepository.findByEmail(email);
      if (!userExist) {
        return { message: "user didn't exist", success: false };
      }

      // Hash the new password
      const hashedPassword = await hashPassword(password);

      // Update the user's password in the database
      const updatePassword = await this.userRepository.resetPassword(email, hashedPassword);

      // Check if password update was successful
      if (!updatePassword) {
        return {
          message: "update password was failed ! retry again",
          success: false,
        };
      }
      // Return success message
      return {
        message: "successfully updated password ! kindly login with new credentials",
        success: true,
      };
    } catch (error) {
      // Return error message if something goes wrong
      return { message: String(error), success: false };
    }
  }

  //user role fetching ======================================================================================

  async getUserRole(email: string): Promise<{ message: string; success: boolean; role?: string }> {
    try {
      const userRole = await this.userRepository.findByEmail(email);
      if (!userRole) {
        return { message: "user not found", success: false };
      }

      return {
        message: "user data fetched success",
        success: true,
        role: userRole.role,
      };
    } catch (error) {
      return { message: String(error), success: false };
    }
  }
  //============================================================================================================================

  /**
   * Verify the Google sign-in token and return the user's email if successful.
   * Store the user's email in Redis with a TTL of 20 minutes.
   * @param token The Google sign-in token
   * @returns An object containing the message, success status, and the user's email if successful
   */
  async verifyGoogleSignIn(token: string): Promise<{ message: string; success: boolean; email?: string }> {
    try {
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
        return { message: "payload data not found!", success: false };
      }

      // Extract the user's email from the payload
      const email = payload?.email;

      const userExist = await this.userRepository.findByEmail(String(email));
      if (userExist) {
        return { message: "User already exist . Try to login", success: false };
      }

      // Store the user's email in Redis
      await setRedisData(`tempEmail:${email}`, email, 1200);

      // Return the success message and the user's email
      return {
        message: "successfull, fill the form to continue",
        success: true,
        email,
      };
    } catch (error) {
      // Return an error message if something goes wrong
      return { message: String(error), success: false };
    }
  }

  //======================================================================================================

  async getResendOTP(email: string): Promise<{ message: string; success: boolean }> {
    try {
      const verifyEmail = await getRedisData(`verifyEmail:${email}`);
      if (!verifyEmail) {
        return { message: "user data not found", success: false };
      }
      await deleteRedisData(`verifyEmail:${email}`);
      const otp = generateOTP();
      await setRedisData(`verifyEmail:${email}`, { otp, email }, 240);

      const notificationPayload = {
        email,
        type: "registration",
        otp,
        subject: `OTP for Registration`,
        message: `Hi , your OTP for registration is ${otp}`,
        template: "otpTemplate",
      };

      //send to notification queue
      await publishToQueue(RabbitMQConfig.notificationQueue, notificationPayload);

      return { message: "Resend otp sended to email", success: true };
    } catch (error) {
      return { message: String(error), success: false };
    }
  }

  // super admin login verification ==========================================================================================

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
    try {
      const findUser = await this.userRepository.findByEmail(email);
      if (!findUser) {
        return {
          message: Messages.USER_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }

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

      const payload = {
        authUserUUID: findUser.authUserUUID,
        email: findUser.email,
        role: findUser.role,
      };

      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return {
        message: Messages.LOGIN_SUCCESS,
        statusCode: HttpStatus.OK,
        success: true,
        tockens: { accessToken, refreshToken },
        role: findUser.role,
      };
    } catch (error) {
      return {
        message: String(error),
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  //====================================================================================================================

  async verifyUser(email: string): Promise<{
    message: string;
    success: boolean;
    statusCode: number;
    accessToken?: string;
  }> {
    try {
      const getUser = await this.userRepository.findByEmail(email);
      if (!getUser) {
        return {
          message: Messages.USER_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
      if (getUser.isBlock) {
        return {
          message: Messages.USER_BLOCKED,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }

      const payload: UserData = {
        authUserUUID: getUser.authUserUUID,
        email: getUser.email,
        role: getUser.role,
      };

      const accessToken = await generateAccessToken(payload);

      return {
        message: Messages.OK,
        statusCode: HttpStatus.OK,
        success: true,
        accessToken,
      };
    } catch (error) {
      console.error("error while verifyUser", error);
      return {
        message: Messages.SERVER_ERROR,
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async updateUserBlockStatus(
    email: string
  ): Promise<{ message: string; success: boolean; statusCode: number; userDataPayload?: object }> {
    try {
      const findUser = await this.userRepository.findByEmail(email);
      if (!findUser) {
        return { message: Messages.USER_NOT_FOUND, statusCode: HttpStatus.NOT_FOUND, success: false };
      }
      const getStatus: boolean = !findUser.isBlock;

      const updateUser = await this.userRepository.userBlockStatusUpdate(email, getStatus);
      if (!updateUser) {
        return { message: Messages.USER_UPDATE_FAILED, statusCode: HttpStatus.BAD_REQUEST, success: false };
      }

      const userDataPayload = {
        email: updateUser.email,
        isBlock: updateUser.isBlock,
      };

      return { message: Messages.USER_UPDATE_SUCCESS, statusCode: HttpStatus.OK, success: true, userDataPayload };
    } catch (error) {
      console.error("error while udpate user status", error);
      return { message: Messages.SERVER_ERROR, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, success: false };
    }
  }

  async validateForgotPasswordReq(email: string): Promise<basicResponse> {
    try {
      const userIsExist = await this.userRepository.findByEmail(email);
      if (!userIsExist) {
        return { message: Messages.USER_NOT_FOUND, success: false, statusCode: HttpStatus.BAD_REQUEST };
      }
      //create a token using nano module
      const token = nanoid();
      const storeData = await setRedisData(token, userIsExist.email, 300);
      if (storeData !== "OK") {
        return { message: Messages.SERVER_ERROR, success: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR };
      }
      const notificationPayload = {
        email: userIsExist.email,
        type: "change-password-link",
        resetLink: `${config.resetPasswordUrlLink}?token=${token}`,
        subject: `Reset Password link`,
        template: `resetPasswordTemplate`,
      };

      //send to notification queue
      await publishToQueue(RabbitMQConfig.notificationQueue, notificationPayload);

      return {
        message: Messages.FORGOT_PASS_LINK,
        success: true,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async handleResetPassword(token: string, password: string): Promise<basicResponse> {
    try {
      //fetching data from reddis
      const getEmail = await getRedisData(token);
      console.log("email:",token, "getEmail : ",getEmail)
      if (!getEmail) {
        return { message: Messages.TOKEN_EXPIRED, success: false, statusCode: HttpStatus.BAD_REQUEST };
      }
      //get hashed password
      const getHashPassword = await hashPassword(password);
      const updateUser = await this.userRepository.updatePasswordByEmail(getEmail, getHashPassword);
      if (updateUser) {
        return { message: Messages.PASSWORD_UPDATED, statusCode: HttpStatus.OK, success: true };
      } else {
        return { message: Messages.SERVER_ERROR, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, success: false };
      }
    } catch (error) {
      throw error;
    }
  }
}
