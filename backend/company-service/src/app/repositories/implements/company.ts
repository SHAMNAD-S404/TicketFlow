import { BaseRepository } from "./baseRepository";
import { ICompanyRepository } from "../interface/IcompanyRepo";
import { ICompany } from "../../models/interface/IcompanyModel";
import CompanyModel from "../../models/implements/company";

class CompanyRepository
  extends BaseRepository<ICompany>
  implements ICompanyRepository
{
  constructor() {
    super(CompanyModel); // Pass the CompanyModel to the BaseRepository constructor
  }

  async createCompany(company: ICompany): Promise<ICompany> {
    try {
      return await this.create(company);
    } catch (error) {
      throw new Error(`Failed to create company. error : ${error}`);
    }
  }

  async findOneByEmail(email: string): Promise<ICompany | null> {
    try {
      return await this.findOneWithEmail(email);
    } catch (error) {
      throw error;
    }
  }

  async findByAuthUserUUID(authUserUUID: string): Promise<ICompany | null> {
    try {
      return await this.findOneByUUID(authUserUUID);
    } catch (error) {
      throw error;
    }
  }

  async updateProfileByEmail(
    email: string,
    updateData: Partial<ICompany>
  ): Promise<ICompany | null> {
    try {
      const updateCompany = await this.updatByEmail(email, updateData);
      return updateCompany;
    } catch (error) {
      throw error;
    }
  }

  async findAllCompany(
    page: number,
    sort: string,
    searchKey: string
  ): Promise<{ companies: ICompany[] | null; totalPages: number }> {
    try {
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

      const totalFilteredDocuments = await this.model.countDocuments(
        serchFilter
      );
      const totalPages = Math.ceil(totalFilteredDocuments / limit);
      return { companies: fetchAllDocument, totalPages };
    } catch (error) {
      console.error("error while fetching company data : ", error);
      throw error;
    }
  }

  async updateCompanyStatus(
    email: string,
    isBlock: boolean
  ): Promise<ICompany | null> {
    try {
      return await this.updateUserStatus(email, isBlock);
    } catch (error) {
      throw error;
    }
  }

  async updateImageUrl(email: string, imageUrl: string): Promise<string | null> {
    try {

      const result = await this.model.findOneAndUpdate(
        {email },
        {$set : {imageUrl : imageUrl}},
        {upsert : true , new : true ,projection : {_id :0 , imageUrl:1}}
    )

    return result ? imageUrl : null;

    } catch (error) {
      throw error
    }
  }


}

export default new CompanyRepository();
