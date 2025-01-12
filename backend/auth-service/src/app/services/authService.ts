import { UserRepository } from "../repositories/userRepository";
import { RegisterUserDTO } from "../dtos/registerUserDTO";
import { IAuthService } from "../interfaces/IAuthService";


export class AuthService implements IAuthService {
    // private userRepository : UserRepository;

    constructor( private userRepository : UserRepository){
        //  this.userRepository = userRepository;
    }


    async registerUser(data:RegisterUserDTO) : Promise<{message:string,success:boolean}> {
        const {email,password,companyName}=data;
        if(!email||!password||!companyName){
            return {message:'plase provide all the details',success:false}
        }
        const exists = await this.userRepository.findByEmail(email as string);
        if (exists) {
            return {message:"User already exists",success:false}
        }
        // const passHash = bcrypt.hash(password,10)
        const  UserData = await this.userRepository.createUser(email,password,companyName);
        return {message:`uesr saved ${UserData}`,success:true}
    }
}