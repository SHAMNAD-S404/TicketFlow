import { ICompany } from "../../models/interface/IcompanyModel";
import CompanyRepository from "../../repositories/implements/company";
import { ICompanyService } from "../interface/ICompanyService";

export default class CompanyService implements ICompanyService {
  /**
   * Create a new company
   * @param companyData Company data to be created
   * @returns {message : string,data?:ICompany, success : boolean}
   *              message: success or error message
   *              data: created company data if successful
   *              success: true if successful, false otherwise
   */


  async createCompany(
    companyData: ICompany
  ): Promise<{ message: string; data?: ICompany; success: boolean }> {
    try {
      // check if company with the same email already exists
      const existingCompany = await CompanyRepository.findOneWithEmail(
        companyData.email
      );
      if (existingCompany) {
        return {
          message: "company with this email id already exists",
          success: false,
        };
      }

      // create the company
      const newCompany = await CompanyRepository.createCompany(companyData);
      if (!newCompany) {
        return { message: "Failed to create company", success: false };
      } else {
        return {
          message: "company created successfully",
          data: newCompany,
          success: true,
        };
      }
    } catch (error) {
      return { message: String(error), success: false };
    }
  }




  /**
   * Fetch a company data by user ID
   * @param userId The user ID to find the company data
   * @returns {message : string,data?:ICompany, success : boolean}
   *              message: success or error message
   *              data: fetched company data if successful
   *              success: true if successful, false otherwise
   */
  async fetchCompanyData(
    authUserUUID: string
  ): Promise <{
     message: string;
     data?: ICompany;
     success: boolean }> {
    try {
      // Find the company data by user ID
      const fetchCompanyData = await CompanyRepository.findByAuthUserUUID(authUserUUID);
      if (!fetchCompanyData) {

        // Return an error if company data is not found
        return { message: "Comapny data not found !", success: false };
      } else {

        // Return the fetched company data if successful
        return {
          message: `Welcome ${fetchCompanyData.companyName}`,
          data: fetchCompanyData,
          success: true,
        };
      }
    } catch (error) {
      // Return an error if fetching fails
      return { message: String(error), success: false };
    }
  }

  async getCompanyIdWithAuthUserUUID(userUUID: string): Promise<string> {
    try {

      const companyId = await CompanyRepository.findByAuthUserUUID(userUUID);
      if(!companyId){
        throw new Error("Company not found")
      }
      return String(companyId._id) ;
      
    } catch (error) {
      throw new Error(`Failed to get company by authUserUUID: ${error}`);

    }
  }

  async getCompanyUpdateProfile(email: string, upateData: Partial<ICompany>): Promise<{ message: string; success: boolean; data?: ICompany; }> {
    try {

      const isExist = await CompanyRepository.findOneByEmail(email)
      if(!isExist){
        return {message: "user not found",success:false}
      }
      const updateCompany = await CompanyRepository.updateProfileByEmail(email,upateData)
      if(!updateCompany){
        return {message: "failed to update try agian",success:false}
      }

      return {message : "user profile updated successfull",success:true}
    } catch (error) {
      return { message: String(error), success: false };

    }
  }

  


}
