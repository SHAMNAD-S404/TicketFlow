import { UserDocument } from "../../models/implements/User";
import User from "../../models/implements/User";
import { IUser } from "../../models/interface/IUser";
import { IUserRepository } from "../interface/IUserRepository";
import { BaseRepository } from "./baseRespository";

/**
 * @class UserRepository
 * @augments BaseRepository<UserDocument>
 * @implements IUserRepository
 * @description Manages data access operations for the User entity.
 * Provides a concrete implementation for interacting with the user collection in the database.
 */
export class UserRepository extends BaseRepository<UserDocument> implements IUserRepository {
  constructor() {
    /**
     * @param User -  represents the Mongoose model for the User schema.
     */
    super(User);
  }

//======================================== DELETE USER ===========================================================

  async deleteUser(UserId: string): Promise<void> {
    // delete the user by their ID
    await this.deleteById(UserId);
  }

//======================================== RESET PASSWORD =========================================================

  async resetPassword(email: string, password: string): Promise<IUser | null> {
    // Attempt to update the user document with the new password
    const updatedUser = await this.model.findOneAndUpdate(
      { email },
      { password, isFirstLogin: false },
      { new: true }
    );
    // Return the updated user document, or null if no user was found
    return updatedUser;
  }

//======================================== FIND USER BY UUID =======================================================

  async getUserByAuthUserUUID(authUserUUID: string): Promise<IUser | null> {
    const user = await this.findByAuthUserUUID(authUserUUID);
    return user;
  }

//======================================== UPDATE PASSWORD BY EMAIL =================================================

  async updatePasswordByEmail(email: string, hashPassword: string): Promise<IUser | null> {
    return await this.updateOneDocument({ email: email }, { password: hashPassword });
  }

//======================================== CHANGE PASSWORD ============================================================

  async changePasswordRepo(
    searchQuery: Record<string, string>,
    updateData: Record<string, string>
  ): Promise<boolean> {
    const result = await this.updateOneDocument(searchQuery, updateData);
    return result ? true : false;
  }

//======================================== ****************************** =================================================

}
