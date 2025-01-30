import { RegisterUserDTO } from "../../dtos/registerUserDTO";

export interface IAuthService {
    registerUser(data:RegisterUserDTO) : Promise<{message:string,success:boolean}>
    verifyOTP(email:string,otp:string) : Promise<{message:string,success:boolean}>
    verifyLogin(email:string,password:string) : Promise<{message:string,success:boolean,tockens?:{accessToken:string,refreshToken:string},isFirst?:boolean,role?:string}>
    verifyEmail(email:string) : Promise<{message:string,success:boolean}>
    updateUserPassword(email:string,password:string) : Promise<{message:string,success:boolean} >
    getUserRole(email:string) : Promise<{message:string,success:boolean,role?:string}>
}

