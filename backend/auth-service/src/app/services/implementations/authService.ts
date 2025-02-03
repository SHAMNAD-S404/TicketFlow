import { UserRepository } from "../../repositories/implements/userRepository";
import { RegisterUserDTO } from "../../dtos/registerUserDTO";
import { IAuthService } from "../../services/interface/IAuthService";
import { hashPassword, comparePassword } from "../../../utils/hashUtils";
import {
  deleteRedisData,
  getRedisData,
  setRedisData,
} from "../../../utils/redisUtils";
import { generateOTP } from "../../../utils/otpUtils";
import { RabbitMQConfig } from "../../../config/rabbitmq";
import { publishToQueue } from "../../../queues/publisher";
import { publishToQueueWithRPCAndRetry } from "../../../queues/publisherWithRPCAndRetry";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/jwtUtils";
import { UserRoles } from "../../types/roles";
import { v4 as uuidv4 } from "uuid";

export class AuthService implements IAuthService {
  constructor(private userRepository: UserRepository) {}

  /**
   * Registers a new user with the provided data
   * @param data The user registration data
   * @returns A promise that resolves to an object containing a message and a boolean indicating success or failure
   */
  async registerUser(
    data: RegisterUserDTO
  ): Promise<{ message: string; success: boolean }> {
    try {
      const {
        email,
        password,
        companyName,
        companyType,
        phoneNumber,
        corporatedId,
        originCountry,
      } = data;

      //check if email and password and other details are provided
      if (
        !email ||
        !password ||
        !companyName ||
        !companyType ||
        !phoneNumber ||
        !corporatedId ||
        !originCountry
      ) {
        return { message: "please provide all the details", success: false };
      }

      //check if user already exists in Redis
      const isEmailVerified = await getRedisData(`tempEmail:${email}`);
      if (!isEmailVerified) {
        return { message: `Provide verified email id `, success: false };
      }

      //check if user already exists in DB
      const exists = await this.userRepository.findByEmail(email as string);
      if (exists) return { message: `User already exists  `, success: false };

      //hash password
      const hashedPassword = await hashPassword(password);

      //Generate a UUID V4
      const authUserUUID = uuidv4();

      //store user data in auth-service db.
      const role = UserRoles.Company;
      const storeUser = await this.userRepository.create(
        email,
        hashedPassword,
        role,
        authUserUUID
      );
      if (!storeUser) {
        return { message: "Failed to save user try again", success: false };
      }

      const companyData = {
        authUserUUID: storeUser.authUserUUID,
        email,
        companyName,
        companyType,
        phoneNumber,
        corporatedId,
        originCountry,
      };

      //delete user data from reddis
      await deleteRedisData(`tempEmail:${email}`);

      //sending data to company-service to store in DB.
      const response = await publishToQueueWithRPCAndRetry(
        RabbitMQConfig.companyRPCQueue,
        companyData,
        3
      );
      console.log("response from company service", response);

      if (response.success) {
        return { message: "Company registration successfull", success: true };
      } else {
        await this.userRepository.deleteById(storeUser._id as string);
        return {
          message: "Failed to save data in CS DB, user data rollbacked ",
          success: false,
        };
      }
    } catch (error) {
      return { message: String(error), success: false };
    }
  }

  /**
   * Verifies the OTP for the given email
   * @param email The user's email id
   * @param otp The OTP sent to the user
   * @returns A promise that resolves to an object containing a message and a boolean indicating success or failure
   */
  async verifyOTP(
    email: string,
    otp: string
  ): Promise<{ message: string; success: boolean }> {
    try {
      // Check if email and OTP are provided
      if (!email || !otp) {
        return { message: "please provide email and otp", success: false };
      }

      // Check if user exists in Redis
      const existingTempUser = await getRedisData(`verifyEmail:${email}`);
      if (!existingTempUser) {
        return { message: "User not found", success: false };
      }

      // Check if user already verified data exists in Redis
      const existingTempEmail = await getRedisData(`tempEmail:${email}`);
      if (existingTempEmail) {
        return { message: "OTP Verification successfull ", success: true };
      }

      // Compare the provided OTP with the OTP stored in Redis
      if (existingTempUser.otp !== otp) {
        return { message: "Invalid OTP", success: false };
      }

      // Store user email in reddis and delete verifyemail data from reddis
      await Promise.all([
        setRedisData(`tempEmail:${email}`, email, 1200),
        deleteRedisData(`verifyEmail:${email}`),
      ]);

      return { message: "OTP verification successful", success: true };
    } catch (error) {
      return { message: String(error), success: false };
    }
  }

  /**
   * Verifies the user's login credentials
   * @param email The user's email id
   * @param password The user's password
   * @returns A promise that resolves to an object containing a message and a boolean indicating success or failure.
   * If success is true, the object will also contain an object with refresh and access tokens.
   */
  async verifyLogin(
    email: string,
    password: string
  ): Promise<{
    message: string;
    success: boolean;
    role ?: string;
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

      // Compare the provided password with the hashed password stored in the database
      const isMatch = await comparePassword(password, findUser.password);
      if (!isMatch) {       
        
        return { message: "Invalid Credentials", success: false };
      }

      // Generate access and refresh tokens
      const payload = {
        authUserUUID: findUser.authUserUUID,
        email : findUser.email,
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
        role : findUser.role as string,
      };
    } catch (error) {
      return { message: String(error), success: false };
    }
  }

  /**
   * Verify email address by sending an OTP to the user
   * @param email The user's email address
   * @returns A promise that resolves to an object containing a message and a boolean indicating success or failure.
   */
  async verifyEmail(
    email: string
  ): Promise<{ message: string; success: boolean }> {
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
      await publishToQueue(
        RabbitMQConfig.notificationQueue,
        notificationPayload
      );

      return { message: "Kindly check your email for OTP ", success: true };
    } catch (error) {
      return { message: String(error), success: false };
    }
  }

  async updateUserPassword(email: string, password: string): Promise<{ message: string; success: boolean; }> {
    try {

      const userExist  = await this.userRepository.findByEmail(email)
      if(!userExist){
        return {message : "user didn't exist",success : false}
      }
      const hashedPassword = await hashPassword(password);
      const updatePassword = await this.userRepository.resetPassword(email,hashedPassword);
      if(!updatePassword){
        return {message:"update password was failed ! retry again",success:false}
      }
      return {message:"successfully updated password ! kindly login with new credentials" ,  success:true}
      
    } catch (error) {
      return { message: String(error), success: false };
    }
  }


  async getUserRole(email: string): Promise<{ message: string; success: boolean; role?: string; }> {
     try {

        const userRole = await this.userRepository.findByEmail(email);
        if(!userRole){
          return {message: "user not found", success : false}
        }

        return {message : "user data fetched success",success:true , role:userRole.role}
      
     } catch (error) {
      return { message: String(error), success: false };
     }
  }





}
