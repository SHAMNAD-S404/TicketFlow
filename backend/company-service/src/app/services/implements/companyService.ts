import { ICompany } from "../../models/interface/IcompanyModel";
import CompanyRepository from "../../repositories/implements/company";
import { ICompanyService } from "../interface/ICompanyService";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";

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
          message: Messages.USER_ALREADY_EXIST,
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
  async fetchCompanyData(email: string): Promise<{
    message: string;
    data?: ICompany;
    success: boolean;
  }> {
    try {
      // Find the company data by user ID
      const fetchCompanyData = await CompanyRepository.findOneByEmail(email);
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
      if (!companyId) {
        throw new Error("Company not found");
      }
      return String(companyId._id);
    } catch (error) {
      throw new Error(`Failed to get company by authUserUUID: ${error}`);
    }
  }

  async getCompanyUpdateProfile(
    email: string,
    upateData: Partial<ICompany>
  ): Promise<{ message: string; success: boolean; data?: ICompany }> {
    try {
      const isExist = await CompanyRepository.findOneByEmail(email);
      if (!isExist) {
        return { message:Messages.USER_NOT_FOUND, success: false };
      }
      const updateCompany = await CompanyRepository.updateProfileByEmail(
        email,
        upateData
      );
      if (!updateCompany) {
        return { message:Messages.FAIL_TRY_AGAIN, success: false };
      }

      return { message:Messages.USER_STATUS_UPDATED, success: true };
    } catch (error) {
      return { message: String(error), success: false };
    }
  }

  async getAllCompany(page:number,sort:string,searchKey:string): Promise<{
    message: string;
    successs: boolean;
    data?: {companies:ICompany[] | null,totalPages:number}
    statusCode: number;
  }> {
    try {
      const result = await CompanyRepository.findAllCompany(page,sort,searchKey);
      if (result) {
        return {
          message: Messages.FETCH_SUCCESS,
          successs: true,
          data: result,
          statusCode: HttpStatus.OK,
        };
      } else {
        return {
          message: Messages.DATA_NOT_FOUND,
          successs: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
    } catch (error) {
      return {
        message: Messages.SERVER_ERROR,
        successs: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async companyStatusChange(
    email: string,
    isBlock: boolean
  ): Promise<{ message: string; success: boolean; statusCode: number }> {
    try {
      if (!email || typeof isBlock !== "boolean") {
        return {
          message: Messages.ALL_FILED_REQUIRED_ERR,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
      const findCompany = await CompanyRepository.findOneByEmail(email);
      if (!findCompany) {
        return {
          message: Messages.USER_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
      const updateStatus = await CompanyRepository.updateCompanyStatus(
        email,
        isBlock
      );
      if (!updateStatus) {
        return {
          message: Messages.FAIL_TRY_AGAIN,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
      return {
        message: Messages.USER_STATUS_UPDATED,
        statusCode: HttpStatus.OK,
        success: true,
      };
    } catch (error) {
      console.log("error while performing company block operation ", error);
      return {
        message: Messages.SERVER_ERROR,
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async updateProfileImage(email: string, imageUrl: string): Promise<{ message: string; success: boolean; statusCode: number; imageUrl?: string; }> {
    try {

      const result = await CompanyRepository.updateImageUrl(email,imageUrl);
      if(result){
        return {
          message : Messages.IMAGE_UPDATED,
          success : true,
          statusCode : HttpStatus.OK,
          imageUrl : result
        }
      }else{
        return {
          message : Messages.DATA_NOT_FOUND,
          statusCode:HttpStatus.BAD_REQUEST,
          success : false
        }
      }

    } catch (error) {
      throw error
    }
  }


}
