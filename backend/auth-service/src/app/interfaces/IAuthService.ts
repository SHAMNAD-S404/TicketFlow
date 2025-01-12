import { RegisterUserDTO } from "../dtos/registerUserDTO";

export interface IAuthService {
    //isUserExists(email:string) : Promise<boolean>;
    registerUser(data:RegisterUserDTO) : Promise<{message:string,success:boolean}>
}

