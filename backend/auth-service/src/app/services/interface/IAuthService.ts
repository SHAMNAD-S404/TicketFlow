import { RegisterUserDTO } from "../../dtos/registerUserDTO";

export interface IAuthService {
    registerUser(data:RegisterUserDTO) : Promise<{message:string,success:boolean}>
    verifyOTP(email:string,otp:string) : Promise<{message:string,success:boolean}>
    verifyLogin(email:string,password:string) : Promise<{message:string,success:boolean,tockens?:{accessToken:string,refreshToken:string},isFirst?:boolean}>
    verifyEmail(email:string) : Promise<{message:string,success:boolean}>
    updateUserPassword(email:string,password:string) : Promise<{message:string,success:boolean} >
}

