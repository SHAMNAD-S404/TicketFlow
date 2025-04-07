import { IUser } from "../../models/interface/IUser";


export interface IUserRepository {
findByEmail(email: string): Promise<IUser | null | string>;
createUser(email:string,password:string,name:string,authUserUUID:string):Promise<IUser|undefined>;
deleteUser(UserId:string):Promise<any>;
getUserByAuthUserUUID(authUserUUID :string) : Promise<IUser | null>;
resetPassword(email:string,password:string) : Promise<IUser | null> ;
userBlockStatusUpdate(email : string , status:boolean) : Promise<IUser | null > 
updatePasswordByEmail (email : string , hashPassword:string) : Promise <IUser | null>;
changePasswordRepo (searchQuery : Record<string,string>,updateData:Record<string,string>) : Promise<boolean>
}
