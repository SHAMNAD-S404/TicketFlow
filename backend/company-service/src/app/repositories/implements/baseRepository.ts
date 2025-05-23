import { Model, Document } from "mongoose";
import { IBaseRepository } from "../interface/IBaseRepository";


/**
 * @class BaseRepository
 * @description Provides a generic base repository for database operations,
 * abstracting common CRUD (Create, Read, Update, Delete) functionalities.
 * It works with any Mongoose document type that extends `Document`.
 * @implements {IBaseRepository<T>}
 * @template T The Mongoose Document type that this repository will operate on.
 */

export class BaseRepository<T extends Document> implements IBaseRepository<T> {

  /**
   * @type {Model<T>}
   * @description The Mongoose model instance used for database interactions for this specific entity.
   */

  constructor(protected readonly model: Model<T>) {}

//========================= CREATE DOCUMENT ========================================

  async create(item: Partial<T>): Promise<T> {
    const createdDocument = new this.model(item);
    return await createdDocument.save();
  }

//========================= FIND ONE DOCUMENT WITH EMAIL ===========================
  async findOneWithEmail(email: string): Promise<T | null> {
    return await this.model.findOne({ email });
  }

//========================= FIND ONE DOC BY UUID ====================================
  async findOneByUUID(authUserUUID: string): Promise<T | null> {
    return await this.model.findOne({ authUserUUID: authUserUUID });
  }

//========================= IS USER EXIST CHECKING ===================================
  async isUserExistByEmail(email: string): Promise<T | null> {
    return await this.model.findOne({ email }).select("_id");
  }

//========================= UPDATE DOCS BY EMAIL =====================================
  async updatByEmail(email: string, updateData: Partial<T>): Promise<T | null> {
    return await this.model.findOneAndUpdate({ email }, updateData, {
      new: true,
    });
  }

//========================= FIND ALL DOCS =============================================
  async findAll(): Promise<T[] | null> {
    return await this.model.find().select("-updatedAt -__v");
  }

//========================= UPDATE USER STATUS ========================================
  async updateUserStatus(email: string, blockStatus: boolean): Promise<T | null> {
    return await this.model.findOneAndUpdate(
      { email: email },
      { $set: { isBlock: blockStatus } },
      { new: true }
    );
  }

//========================= UPDATE ONE DOCUEMENT =======================================
  async updateOneDocument(
    searchQuery: Record<string, string>,
    updateData: Partial<T>
  ): Promise<T | null> {
    return await this.model.findOneAndUpdate(searchQuery, { $set: updateData }, { new: true });
  }

//========================= FIND ONE DOCUMENT ==========================================
  async findOneDocument(searchQuery: Record<string, string>): Promise<T | null> {
    return await this.model.findOne(searchQuery);
  }

//========================= COUNT DOCUMENTS =============================================
  //to count the documents based on conditioin
  async getDocumentCount(filter: Record<string, any>): Promise<number> {
    return await this.model.countDocuments(filter);
  }
//========================= INTERFACE FOR CHAT CONTROLLER ===============================

}
