import { UserDocument } from "../../models/implements/User";
import User from "../../models/implements/User";
import { IUser } from "../../models/interface/IUser";
import { IUserRepository } from "../interface/IUserRepository";
import { BaseRepository } from "./baseRespository";

export class UserRepository extends BaseRepository<UserDocument> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      // Attempt to find the user by email
      return await this.findUserByEmail(email);
    } catch (error) {
      throw error;
    }
  }

  async createUser(email: string, password: string, role: string, authUserUUID: string,subscriptionEndDate:string): Promise<IUser | undefined> {
    try {
      return await this.create(email, password, role, authUserUUID,subscriptionEndDate);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(UserId: string): Promise<void> {
    try {
      // Attempt to delete the user by their ID
      await this.deleteById(UserId);
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(email: string, password: string): Promise<IUser | null> {
    try {
      // Attempt to update the user document with the new password
      const updatedUser = await this.model.findOneAndUpdate(
        { email },
        { password, isFirstLogin: false },
        { new: true }
      );
      // Return the updated user document, or null if no user was found
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async getUserByAuthUserUUID(authUserUUID: string): Promise<IUser | null> {
    try {
      const user = await this.findByAuthUserUUID(authUserUUID);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async userBlockStatusUpdate(email: string, status: boolean): Promise<IUser | null> {
    try {
      return await this.blockAndUnblockUserWithEmail(email, status);
    } catch (error) {
      throw error;
    }
  }

  async updatePasswordByEmail(email: string, hashPassword: string): Promise<IUser | null> {
    return await this.updateOneDocument({ email: email }, { password: hashPassword });
  }

  async changePasswordRepo(searchQuery: Record<string, string>, updateData: Record<string, string>): Promise<boolean> {
    const result = await this.updateOneDocument(searchQuery, updateData);
    return result ? true : false;
  }
}
