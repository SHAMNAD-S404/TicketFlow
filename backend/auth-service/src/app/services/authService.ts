import { UserRepository } from "../repositories/userRepository";
import { RegisterUserDTO } from "../dtos/registerUserDTO";
import { IAuthService } from "../interfaces/IAuthService";
import { hashPassword } from "../../utils/hashUtils";
import {deleteRedisData, getRedisData, setRedisData} from "../../utils/redisUtils"
import { generateOTP } from '../../utils/otpUtils';
import { RabbitMQConfig } from "../../config/rabbitmq";
import { publishToQueue } from "../../queues/publisher";
import { publishToQueueWithRPCAndRetry } from "../../queues/publisherWithRPCAndRetry";




export class AuthService implements IAuthService {
    // private userRepository : UserRepository;
    constructor( private userRepository : UserRepository){
        //  this.userRepository = userRepository;
    }

    async registerUser(data:RegisterUserDTO) : Promise<{message:string,success:boolean}> {
    
        try {
            console.log(" hiiii im inside service dataa" ,data)
            console.log("=====================================");
            
            const {email,password,companyName,companyType, phoneNumber , corporatedId ,originCountry }=data;

            if(!email||!password||!companyName){
                return {message:'please provide all the details',success:false}
            }

            //check if user already exists in Redis
            const existingTempUser = await getRedisData(email as string);
            if(existingTempUser){
                return {message:`User registraction already in progress`,success:false}
            }

            //check if user already exists in DB
            const exists = await this.userRepository.findByEmail(email as string);
            if (exists)  return {message:`User already exists  `,success:false};

            //hash password
            const hashedPassword = await hashPassword(password);

            //store user data in Redis for 15 minutes
            await setRedisData(`user:${email}`,{...data,password:hashedPassword},900)

            //generate OTP
            const otp =  generateOTP();
            //store otp in Redis for 4 minutes
            await setRedisData(`otp:${email}`,{otp,email},240);

            //send OTP and user data to notification queue using RabbitMQ
            const notificationPayload = {
                email,
                otp,
                subject : `OTP for registration`,
                message : `Dear ${companyName}, your OTP for registration is ${otp}.`,
                template : 'otpTemplate',
            }
            
            await publishToQueue(RabbitMQConfig.notificationQueue,notificationPayload);

            return {message:`Registraction successfull check your email for OTP`,success:true}

        } catch (error) {
            return {message:String(error),success:false}
        }
    }

    async verifyOTP(email: string, otp: string): Promise<{ message: string; success: boolean; }> {
        try {

            if(!email || !otp){
                return {message:'please provide email and otp',success:false}
            }

            //check if user exists in Redis
            const existingTempUser = await getRedisData(`user:${email}`);
            if(!existingTempUser){
                return {message : 'User not found',success:false}
            }
            //check if otp exists in Redis
            const existingOTP = await getRedisData(`otp:${email}`);
            if(!existingOTP){
                return {message:"OTP expired",success:false}
            }

            if(existingOTP.otp !== otp){
                return {message: "Invalid OTP",success:false};   
            }

            //save user in auth-db
            const user = await this.userRepository.create(existingTempUser.email,existingTempUser.password);
            if(!user){
                return {message:"Failed to save user",success:false}
            }

            delete existingTempUser.password;
            const companyData = {...existingTempUser,authUser:user._id};

            //delete user data from Redis
            await Promise.all([
                deleteRedisData(`user:${email}`),
                deleteRedisData(`otp:${email}`)
            ]);

            //save company data in db
            const response = await publishToQueueWithRPCAndRetry( RabbitMQConfig.companyRPCQueue,companyData,3);
            console.log("response from company service",response);

            if (response.success) {
                return{message:"User registered successfully",success:true};
            }else{
                await this.userRepository.deleteById(user._id as string);
                return{message:" Failed to save data in CS DB, user rollbacked  ",success:false}
            }
            
            
        } catch (error) {
            return{message:String(error),success:false}
        }
    }
}