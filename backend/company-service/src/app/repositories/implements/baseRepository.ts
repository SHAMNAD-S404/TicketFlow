import { Model, Document } from "mongoose";
import { IBaseRepository } from "../interface/IBaseRepository";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  /**
   * Constructor for the BaseRepository class
   * @param model The mongoose model for the collection
   */
  constructor(protected readonly model: Model<T>) {}

  
  /**
   * Create a new document in the database
   * @param item The data to create the document with
   * @returns The created document
   */
  async create(item: Partial<T>): Promise<T> {
    try {
      // Create a new document using the provided data
      const createdDocument = new this.model(item);
      return await createdDocument.save();
    } catch (error) {
      // If there is an error, throw a specific error message
      throw error;
    }
  }


  /**
   * Finds a document by email.
   * @param email The email of the document to find.
   * @returns The document or null if no document is found.
   */
  async findOneWithEmail(email: string): Promise<T | null> {
    try {
      // Find one document by email
      const result = await this.model.findOne({ email });
      return result;
    } catch (error) {
      // If an error occurs, throw it
      throw error;
    }
  }


  /**
   * Finds a document by user ID.
   * @param authUser The user ID of the document to find.
   * @returns The document or null if no document is found.
   */
  async findOneByUUID(authUserUUID: string): Promise<T | null> {
    try {
      // Find one document by user ID
      const result = await this.model.findOne({ authUserUUID:authUserUUID });
      return result;
    } catch (error) {
      // If an error occurs, throw it
      throw error;
    }
  }

  async  isUserExistByEmail(email: string): Promise<T | null> {
    try {

      const result = await this.model.findOne({email}).select('_id');
      return result;

    } catch (error) {
      throw error;
    }
  }

  async updatByEmail(email: string, updateData: Partial<T>): Promise<T | null> {
    try {

      return await this.model.findOneAndUpdate({email},updateData,{new:true});
      
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<T[] | null> {
    try {
      return await this.model.find().select('-updatedAt -__v')
      
    } catch (error) {
      throw error
    }
  }

}
