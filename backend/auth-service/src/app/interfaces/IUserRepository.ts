import { IUser } from "./IUser";


export interface IUserRepository {
 // findByEmail(email: string): Promise<IUser | null>;
createUser(email:string,password:string,name:string):Promise<IUser|undefined>;
}
