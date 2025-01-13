import { UserRepository } from "../repositories/userRepository";
import { RegisterUserDTO } from "../dtos/registerUserDTO";
import { IAuthService } from "../interfaces/IAuthService";
import { hashPassword } from "../../utils/hashUtils";
import {deleteRedisData, getRedisData, setRedisData} from "../../utils/redisUtils"
import { generateOTP } from '../../utils/otpUtils';
import { RabbitMQConfig } from "../../config/rabbitmq";
import { publishToQueue } from "../../queues/publisher";




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
                console.log(existingTempUser)
                return {message:`User registraction already in progress`,success:false}
            }

            //check if user already exists in DB
            const exists = await this.userRepository.findByEmail(email as string);
            if (exists)  return {message:`User already exists `,success:false};

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
                message : `Dear ${companyName}, your OTP for registration is ${otp}.`,
            }
            console.log("1111 in service before the rabiit mq que name",RabbitMQConfig.notificationQueue)
            await publishToQueue(RabbitMQConfig.notificationQueue,notificationPayload);



            return {message:`User data saved in Redis and OTP sent to notification service`,success:true}

            


      
        } catch (error) {
            return {message:String(error),success:false}
        }
    }
}