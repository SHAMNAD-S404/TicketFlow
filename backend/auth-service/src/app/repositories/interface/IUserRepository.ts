import { IUser } from "../../models/interface/IUser";

//======================================== INTERFACE FOR USER REPOSITORY =================================================

export interface IUserRepository {



deleteUser              (UserId:string):Promise<any>;

getUserByAuthUserUUID   (authUserUUID :string) : Promise<IUser | null>;

resetPassword           (email:string,password:string) : Promise<IUser | null> ;

updatePasswordByEmail   (email : string , hashPassword:string) : Promise <IUser | null>;

changePasswordRepo      (searchQuery : Record<string,string>,updateData:Record<string,string>) : Promise<boolean>;

}
