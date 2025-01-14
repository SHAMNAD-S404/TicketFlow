import { IUser } from "./IUser";


export interface IUserRepository {
findByEmail(email: string): Promise<IUser | null | string>;
createUser(email:string,password:string,name:string):Promise<IUser|undefined>;
deleteUser(UserId:string):Promise<any>;
}
