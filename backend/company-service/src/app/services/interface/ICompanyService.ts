import { ICompany } from "../../models/interface/IcompanyModel";
import { IBaseResponse } from "../../interfaces/IBaseResponse";

interface IUpdateProfileImage extends IBaseResponse {
  imageUrl?: string;
}
export interface ISubStaticResp extends IBaseResponse {
  data: {
    activeUserCount: number;
    expiredUserCount: number;
  };
}

export interface IUpdateCompanyResp extends IBaseResponse {
  data: ICompany | null;
}

export interface IFetchCompanyResponse extends IBaseResponse{
    data? : ICompany;
}


//========================= INTERFACE FOR COMPANY SERVICE =============================================

export interface ICompanyService {

  createCompany(
    companyData: ICompany
  ): Promise<{ message: string; data?: ICompany; success: boolean }>;


  fetchCompanyData(email: string): Promise<IFetchCompanyResponse>;


  getCompanyIdWithAuthUserUUID(userUUID: string): Promise<string>;


  getCompanyUpdateProfile(
    email: string,
    upateData: Partial<ICompany>
  ): Promise<IFetchCompanyResponse>;


  getAllCompany(
    page: number,
    sort: string,
    searchKey: string
  ): Promise<{
    message: string;
    successs: boolean;
    data?: { companies: ICompany[] | null; totalPages: number };
    statusCode: number;
  }>;


  companyStatusChange(email: string, isBlock: boolean): Promise<IBaseResponse>;


  updateProfileImage(email: string, imageUrl: string): Promise<IUpdateProfileImage>;

  
  getSubsStaticService(): Promise<ISubStaticResp>;


  updateCompanyService(
    searchQuery: Record<string, any>,
    updateQuery: Record<string, any>
  ): Promise<IUpdateCompanyResp>;

}
