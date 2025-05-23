import { ICompany } from "../../models/interface/IcompanyModel";
import CompanyRepository from "../../repositories/implements/company";
import { HttpStatus } from "../../../constants/httpStatus";
import { Messages } from "../../../constants/messageConstants";
import { isPlanExpired } from "../../../utils/isExpiredCheck";
import {
  ICompanyService,
  IFetchCompanyResponse,
  ISubStaticResp,
  IUpdateCompanyResp,
} from "../interface/ICompanyService";
import { IBaseResponse } from "../../interfaces/IBaseResponse";
import { IUpdateProfileImage } from "../interface/IEmployeeService";

/**
 * @class CompanyService
 * @description Implements the core business logic for managing company-related operations.
 * This service processes requests from controllers and interacts with data access layers
 * (e.g., repositories) for company data persistence and retrieval.
 * @implements {ICompanyService}
 */

export default class CompanyService implements ICompanyService {
  //========================= CREATE COMPANY ===============================================

  async createCompany(
    companyData: ICompany
  ): Promise<{ message: string; data?: ICompany; success: boolean }> {
    try {
      // check if company with the same email already exists
      const existingCompany = await CompanyRepository.findOneWithEmail(companyData.email);

      if (existingCompany) {
        return {
          message: Messages.USER_ALREADY_EXIST,
          success: false,
        };
      }

      // Delegating to the repository layer for create the company
      const newCompany = await CompanyRepository.createCompany(companyData);

      return {
        message: "company created successfully",
        data: newCompany,
        success: true,
      };
    } catch (error) {
      return { message: Messages.SOMETHING_WRONG, success: false };
    }
  }

  //========================= FETCH COMPANY DATA FROM REPOSITORY ========================================

  async fetchCompanyData(email: string): Promise<IFetchCompanyResponse> {

    // Find the company data by user ID
    const getData = await CompanyRepository.findOneByEmail(email);

    if (!getData) {
      return {
        message: Messages.USER_NOT_FOUND,
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    let companyData: ICompany = getData;
    //checking for plan is expired or not
    const isSubsExpired = isPlanExpired(getData.subscriptionEndDate);

    //if its expired then updating the fields
    if (isSubsExpired) {
      const updateCompany = await CompanyRepository.updateOneDocument(
        { email: getData.email },
        { isSubscriptionExpired: true }
      );
      //updating latest value
      companyData = updateCompany || getData;
    }

    // Return the fetched company data if successful
    return {
      message: `Welcome ${getData.companyName}`,
      data: companyData,
      success: true,
      statusCode : HttpStatus.OK
    };
  }


  //========================= GET COMPANY ID WITH USER UUID  =============================================

  async getCompanyIdWithAuthUserUUID(userUUID: string): Promise<string> {
      // get company id from repository layer
      const companyId = await CompanyRepository.findByAuthUserUUID(userUUID);
      if (!companyId) {
        throw new Error("Company not found");
      }
      return String(companyId._id);
  }

  //========================= GET UPDATED COMPANY PROFILE =============================================

  async getCompanyUpdateProfile(
    email: string,
    upateData: Partial<ICompany>
  ): Promise<IFetchCompanyResponse> {
   
      // is company exist
      const isExist = await CompanyRepository.findOneByEmail(email);
      if (!isExist) {
        return { 
           message: Messages.USER_NOT_FOUND,
           success: false,
           statusCode : HttpStatus.BAD_REQUEST
          };
      }
      // Delegating to company repository layer for updating company profile
      await CompanyRepository.updateProfileByEmail(email, upateData);

      return {
          message: Messages.USER_STATUS_UPDATED,
          success: true,
          statusCode : HttpStatus.OK
         };
  }

  //========================= GET ALL COMPANY DOCUMENTS  ===============================================

  async getAllCompany(
    page: number,
    sort: string,
    searchKey: string
  ): Promise<{
    message: string;
    successs: boolean;
    data?: { companies: ICompany[] | null; totalPages: number };
    statusCode: number;
  }> {

    // delegating to repository layer for getting all company data
      const result = await CompanyRepository.findAllCompany(page, sort, searchKey);
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
  }

  //========================= COMPANY STATUS CHANGE  ==================================================

  async companyStatusChange(
    email: string,
    isBlock: boolean
  ): Promise<IBaseResponse> {

      if (!email || typeof isBlock !== "boolean") {
        return {
          message: Messages.ALL_FILED_REQUIRED_ERR,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
      // checking for document is exist or not
      const findCompany = await CompanyRepository.findOneByEmail(email);
      if (!findCompany) {
        return {
          message: Messages.USER_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
      // Delegating to the repository layer for updating document
      const updateStatus = await CompanyRepository.updateCompanyStatus(email, isBlock);

      if (!updateStatus) {
        return {
          message: Messages.FAIL_TRY_AGAIN,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
      // if its success
      return {
        message: Messages.USER_STATUS_UPDATED,
        statusCode: HttpStatus.OK,
        success: true,
      };
  }

  //========================= UPDATE PROFILE IMAGE =================================================

  async updateProfileImage(
    email: string,
    imageUrl: string
  ): Promise<IUpdateProfileImage> {

      // delegating to the repository layer for update the image url in document
      const result = await CompanyRepository.updateImageUrl(email, imageUrl);
      if (result) {
        return {
          message: Messages.IMAGE_UPDATED,
          success: true,
          statusCode: HttpStatus.OK,
          imageUrl: result,
        };
      } else {
        return {
          message: Messages.DATA_NOT_FOUND,
          statusCode: HttpStatus.BAD_REQUEST,
          success: false,
        };
      }
  }

  //========================= TO GET THE SUBSCRIPTION STATUS OF A COMPANY =============================================

  async getSubsStaticService(): Promise<ISubStaticResp> {

      // Get substrication statatics asychronusly
      const [activeUserCount, expiredUserCount] = await Promise.all([
        CompanyRepository.getDocumentCount({ isSubscriptionExpired: false }),
        CompanyRepository.getDocumentCount({ isSubscriptionExpired: true }),
      ]);
      return {
        message: Messages.FETCH_SUCCESS,
        success: true,
        statusCode: HttpStatus.OK,
        data: {
          activeUserCount,
          expiredUserCount,
        },
      };
  }

  //========================= UPDATE COMPANY SUBSCRIPTION STATUS =================================================

  async updateCompanyService(
    searchQuery: Record<string, any>,
    updateQuery: Record<string, any>
  ): Promise<IUpdateCompanyResp> {

 
      // Delegating to the repository layer for update one document
      const update = await CompanyRepository.updateOneDocument(searchQuery, updateQuery);
      if (!update) {
        return {
          message: Messages.DATA_NOT_FOUND,
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          data: null,
        };
      }
      // if success
      return {
        message: Messages.UPDATE_SUCCESS,
        statusCode: HttpStatus.OK,
        success: true,
        data: update,
      };

  }
  //========================= *********************************** =============================================
}
