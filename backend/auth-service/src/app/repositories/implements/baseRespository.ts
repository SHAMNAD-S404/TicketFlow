import { Model, Document } from "mongoose";
import { Messages } from "../../../constants/messageConstants";



export class BaseRepository<T extends Document> {
  protected readonly model: Model<T>;

  /**
   * Base repository class for interacting with the database.
   * @param model The mongoose model instance.
   */
  constructor(model: Model<T>) {
    /**
     * The mongoose model instance.
     */
    this.model = model;
  }

  //=================================================== CREATE ===========================================================

  /**
   * Creates a new user in the database.
   * @param email The email of the user.
   * @param password The password of the user.
   * @param role The role of the user.
   * @returns The user document.
   */
  async create(
    email: string,
    password: string,
    role: string,
    authUserUUID: string,
    subscriptionEndDate: string
  ): Promise<T> {
      // Create a new user document
      const userData = { email, password, role, authUserUUID, subscriptionEndDate };
      const document = new this.model(userData);
      // Save the user document
      return await document.save();

  }

  //=========================================== FIND USER BY EMAIL =========================================================
  /**
   * Find a user by email.
   * @param email The email of the user.
   * @returns The user document or null if no user is found.
   */
  async findUserByEmail(email: string): Promise<T | null> {
      // Find one document by email
      return await this.model.findOne({ email });
  
  }

  //=========================================== FIND ONE DOCUMENT WITH ID ===================================================

  /**
   * Finds a document by its ID.
   * @param id The ID of the document to find.
   */
  async findById(id: string): Promise<T | null> {
      //find the document by ID
      return await this.model.findById(id);

  }

  //============================================ FIND ALL DOCS ================================================================
  /**
   * Retrieves all documents from the database.
   * @returns An array of documents.
   */
  async findAll(): Promise<T[]> {
      // Fetch all documents from the collection
      return await this.model.find();
  }

  //=============================================== UPDATE BY ID ================================================================
  /**
   * Updates a document by its ID.
   * @param id The ID of the document to update.
   * @param updateData The data to update the document with.
   * @returns The updated document or null if the document does not exist.
   */
  async updateById(id: string, updateData: Partial<T>): Promise<T | null> {
      // find the document by ID and update it if it exists
      return await this.model.findByIdAndUpdate(id, updateData, { new: true });
  
  }

  //========================================= DELETE BY ID =======================================================================
  /**
   * Deletes a document by its ID.
   * @param id The ID of the document to delete.
   * @returns The deleted document or null if the document does not exist.
   */
  async deleteById(id: string): Promise<T | null> {
      //  find the document by ID and delete it
      return await this.model.findByIdAndDelete(id);
  }

  //========================================= FIND USER BY UUID =======================================================================
  async findByAuthUserUUID(authUserUUID: string): Promise<T | null> {
      return await this.model.findOne({ authUserUUID: authUserUUID });
  }

//========================================= CHANGE BLOCK STATUS WITH EMAIL ============================================================

  async blockAndUnblockUserWithEmail(email: string, status: boolean): Promise<T | null> {
      return await this.model.findOneAndUpdate({ email: email }, { isBlock: status }, { new: true });
  }

//========================================= UPDATE ONE DOCUMENT ========================================================================

  async updateOneDocument(query: Record<string, any>, updateQuery: Record<string, any>): Promise<T | null> {
      return await this.model.findOneAndUpdate(query, { $set: updateQuery }, { new: true });
  }

//======================================== ******************************************* =================================================

}
