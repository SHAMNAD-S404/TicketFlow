import { BaseRepository } from "./baseRepository";
import { ICompanyRepository } from "../interface/IcompanyRepo";
import { ICompany } from "../../models/interface/IcompanyModel";
import CompanyModel from "../../models/implements/company";


/**
 * @class CompanyRepository
 * @augments BaseRepository<ICompany>
 * @implements ICompanyRepository
 * @description Manages data access operations for the Company entity.
 * Provides a concrete implementation for interacting with the company collection in the database.
 */

class CompanyRepository extends BaseRepository<ICompany> implements ICompanyRepository {

  /**
   * @constructor
   * @description Initializes the CompanyRepository with the Mongoose `CompanyModel`.
   */
  constructor() {
    super(CompanyModel); // Pass the CompanyModel to the BaseRepository constructor
  }



//========================= CREATE COMPANY =============================================
  async createCompany(company: ICompany): Promise<ICompany> {
    return await this.create(company);
  }

//========================= FIND ONE BY EMAIL ==========================================
  async findOneByEmail(email: string): Promise<ICompany | null> {
    return await this.findOneWithEmail(email);
  }

//========================= FIND BY UUID ===============================================
  async findByAuthUserUUID(authUserUUID: string): Promise<ICompany | null> {
    return await this.findOneByUUID(authUserUUID);
  }

//=========================  UPDATE DOCUMENT =============================================
  async updateProfileByEmail(
    email: string,
    updateData: Partial<ICompany>
  ): Promise<ICompany | null> {
    const updateCompany = await this.updatByEmail(email, updateData);
    return updateCompany;
  }

//========================= FIND ALL COMPANY =============================================
  async findAllCompany(
    page: number,
    sort: string,
    searchKey: string
  ): Promise<{ companies: ICompany[] | null; totalPages: number }> {
    const limit = 5;
    const pageNumber = Math.max(1, page);
    const filter: Record<string, 1 | -1> = {
      [sort]: sort === "createdAt" ? -1 : 1,
    };
    const serchFilter =
      searchKey.trim() === ""
        ? {}
        : {
            $or: [
              { companyName: { $regex: searchKey, $options: "i" } },
              { email: { $regex: searchKey, $options: "i" } },
            ],
          };

    const fetchAllDocument = await this.model
      .find(serchFilter)
      .sort(filter)
      .skip((pageNumber - 1) * limit)
      .limit(limit);

    const totalFilteredDocuments = await this.model.countDocuments(serchFilter);
    const totalPages = Math.ceil(totalFilteredDocuments / limit);
    return { companies: fetchAllDocument, totalPages };
  }

//========================= UPDATE COMAPNY STATUS =============================================

  async updateCompanyStatus(email: string, isBlock: boolean): Promise<ICompany | null> {
    return await this.updateUserStatus(email, isBlock);
  }

//========================= UPDATE IMAGE URL =============================================

  async updateImageUrl(email: string, imageUrl: string): Promise<string | null> {
    const result = await this.model.findOneAndUpdate(
      { email },
      { $set: { imageUrl: imageUrl } },
      { upsert: true, new: true, projection: { _id: 0, imageUrl: 1 } }
    );

    return result ? imageUrl : null;
  }

//========================= ******************************** =============================================

}

export default new CompanyRepository();
