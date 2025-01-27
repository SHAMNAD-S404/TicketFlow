import { UserDocument } from "../../models/implements/User";
import User from "../../models/implements/User";
import { IUser } from "../../models/interface/IUser";
import { IUserRepository } from "../interface/IUserRepository";
import { BaseRepository } from "./baseRespository";


export class UserRepository extends BaseRepository<UserDocument> implements IUserRepository {
  constructor() {
    super(User); 
  }

  /**
   * Finds a user by their email address.
   * @param email The email address to search for.
   * @returns The user document, or null if no user is found.
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      // Attempt to find the user by email
      return await this.findUserByEmail(email);
    } catch (error: unknown) {
      // Log and rethrow the error if finding fails
      console.error(error instanceof Error ? error.message : String(error), 'error in findByEmail');
      return null;
    }
  }


  /**
   * Creates a new user document.
   * @param email The email address of the user.
   * @param password The password of the user.
   * @param role The role of the user.
   * @returns The new user document, or undefined if creation fails.
   */
  async createUser(email: string, password: string, role: string,authUserUUID:string): Promise<IUser | undefined> {
    try {
      return await this.create(email, password, role,authUserUUID);
    } catch (error: unknown) {
      // Log the error
      console.error(error instanceof Error ? error.message : String(error), 'error in create user');
      // Return undefined if creation fails
      return undefined;
    }
  }
  

  async deleteUser(UserId: string): Promise<any> {
    try {
      return await this.deleteById(UserId);
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : String(error), 'error in delete user');
    }
  }
}

