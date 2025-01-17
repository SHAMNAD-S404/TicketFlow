import { UserDocument } from "../models/User";
import User from "../models/User";
import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import { BaseRepository } from "./baseRespository";


export class UserRepository extends BaseRepository<UserDocument> implements IUserRepository {
  constructor() {
    super(User); 
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await this.findUserByEmail(email);
    } catch (error) {
      return null;
    }
    
  }
  async createUser(email:string,password:string,role:string):Promise<IUser|undefined>{
    try {
      console.log("hiiiii im inside user repo")
      return await this.create(email,password,role);
    } catch (error:unknown) {
      console.log(error instanceof Error? error.message : String(error),'error in create user');

  }
}
 async deleteUser(UserId:string):Promise<any>{
   try {
     return await this.deleteById(UserId)
   } catch (error:unknown) {
     console.log(error instanceof Error? error.message : String(error),'error in delete user');
   }
 }

}

