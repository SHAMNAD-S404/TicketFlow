import { UserRepository } from "../repositories/userRepository";
import { RegisterUserDTO } from "../dtos/registerUserDTO";
import { IAuthService } from "../interfaces/IAuthService";
import { hashPassword } from "../../utils/hashUtils";
import {deleteRedisData, getRedisData, setRedisData} from "../../utils/redisUtils"


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
            await setRedisData(email,{...data,password:hashedPassword},900)

            return {message:`User data saved in Redis`,success:true}


            // const passHash = bcrypt.hash(password,10)
            const  UserData = await this.userRepository.createUser(email,password,companyName);
            return {message:`uesr saved ${UserData}`,success:true}
        } catch (error) {
            return {message:String(error),success:false}
        }
    }
}