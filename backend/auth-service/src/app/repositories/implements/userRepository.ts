import { UserDocument } from "../../models/implements/User";
import User from "../../models/implements/User";
import { IUser } from "../../models/interface/IUser";
import { IUserRepository } from "../interface/IUserRepository";
import { BaseRepository } from "./baseRespository";

export class UserRepository
  extends BaseRepository<UserDocument>
  implements IUserRepository
{
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
      console.error(
        error instanceof Error ? error.message : String(error),
        "error in findByEmail"
      );
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
  async createUser(
    email: string,
    password: string,
    role: string,
    authUserUUID: string
  ): Promise<IUser | undefined> {
    try {
      return await this.create(email, password, role, authUserUUID);
    } catch (error: unknown) {
      // Log the error
      console.error(
        error instanceof Error ? error.message : String(error),
        "error in create user"
      );
      // Return undefined if creation fails
      return undefined;
    }
  }


  /**
   * Deletes a user by their user ID.
   * @param UserId The ID of the user to delete.
   * @throws An error if the deletion fails.
   */
  async deleteUser(UserId: string): Promise<void> {
    try {
      // Attempt to delete the user by their ID
      await this.deleteById(UserId);
    } catch (error: unknown) {
      // Log and rethrow the error if deletion fails
      console.error(
        error instanceof Error ? error.message : String(error),
        "error in delete user"
      );
      throw error;
    }
  }


  /**
   * Resets the password of a user in the database.
   * @param authUserUUID The user ID of the user to reset the password for.
   * @param password The new password.
   * @returns The updated user document, or null if the user was not found.
   * @throws An error if the update fails.
   */
  async resetPassword(
    email: string,
    password: string
  ): Promise<IUser | null> {
    try {
      // Attempt to update the user document with the new password
      const updatedUser = await this.model.findOneAndUpdate(
        { email },
        { password , isFirstLogin:false },
        { new: true }
      );
      // Return the updated user document, or null if no user was found
      return updatedUser;
    } catch (error) {
      // Log the error
      console.error(
        error instanceof Error ? error.message : String(error),
        "error in  update password"
      );
      // Rethrow the error
      throw error;
    }
  }

  async getUserByAuthUserUUID(authUserUUID: string): Promise<IUser | null> {
    try {
      const user = await this.findByAuthUserUUID(authUserUUID);
      return user;
    } catch (error) {
      throw error
    }
  }


}
