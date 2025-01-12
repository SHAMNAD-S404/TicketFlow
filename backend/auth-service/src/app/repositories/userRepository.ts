import { UserDocument } from "../models/User";
import User from "../models/User";
import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import { BaseRepository } from "./baseRespository";

export class UserRepository extends BaseRepository<UserDocument> implements IUserRepository {
  constructor() {
    super(User); 
  }

  async findByEmail(email: string): Promise<IUser | null | string> {
    try {
      return await this.findUserByEmail(email);
    } catch (error) {
      return 'there was an error in finding the user';
    }
    
  }
  async createUser(email:string,password:string,name:string):Promise<IUser|undefined>{
    try {
      console.log("hiiiii im inside user repo")
      return await this.create({email,password,name});
    } catch (error:unknown) {
      console.log(error instanceof Error? error.message : String(error),'error in create user');

  }
}
}

