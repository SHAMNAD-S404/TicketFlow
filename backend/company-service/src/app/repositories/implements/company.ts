import { BaseRepository } from "./baseRepository";
import { ICompanyRepository } from "../interface/IcompanyRepo";
import { ICompany } from "../../models/interface/IcompanyModel";
import CompanyModel from "../../models/implements/company";

class CompanyRepository
  extends BaseRepository<ICompany>
  implements ICompanyRepository
{
  /**
   * Initializes a new instance of the CompanyRepository class.
   * Extends the BaseRepository with the CompanyModel.
   */
  constructor() {
    super(CompanyModel); // Pass the CompanyModel to the BaseRepository constructor
  }

  /**
   * Create a new company in the database
   * @param company The company data to be created
   * @returns The created company data
   */
  async createCompany(company: ICompany): Promise<ICompany> {
    try {
      return await this.create(company);
    } catch (error) {
      throw new Error(`Failed to create company. error : ${error}`);
    }
  }


  /**
   * Find a company by its email.
   * @param email The email of the company to find.
   * @returns The company document or null if no company is found.
   */
  async findOneByEmail(email: string): Promise<ICompany | null> {
    try {
      // Call the findOneWithEmail method from the BaseRepository
      return await this.findOneWithEmail(email);
    } catch (error) {
      // Rethrow the error if finding fails
      throw error;
    }
  }
  


  /**
   * Finds a company by the id of the authenticated user.
   * @param authUser The id of the authenticated user id of the auth-service database.
   * @returns The company document or null if no company is found.
   */
  async findByAuthUserId(authUser: string): Promise<ICompany | null> {
    try {
      // Use the findOneById method from the BaseRepository to find the company
      // document by the id of the authenticated user.
      return await this.findOneById(authUser);
    } catch (error) {
      // Rethrow the error if finding fails
      throw error;
    }
  }
}

export default new CompanyRepository();
