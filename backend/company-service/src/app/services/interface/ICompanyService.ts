import { ICompany } from "../../models/interface/IcompanyModel";
import { IBaseResponse } from "../../interfaces/IBaseResponse";

interface IUpdateProfileImage extends IBaseResponse {
    imageUrl ? : string
}


export interface ICompanyService  {
    createCompany(companyData : ICompany): Promise<{message : string,data?:ICompany, success : boolean}>;
    fetchCompanyData(email : string) : Promise<{message : string, data?:ICompany,success:boolean}>
    getCompanyIdWithAuthUserUUID(userUUID:string) : Promise<string>;
    getCompanyUpdateProfile(email:string, upateData : Partial<ICompany>) : Promise<{message : string , success : boolean , data ? : ICompany}>
    getAllCompany(page:number,sort:string,searchKey:string) : Promise<{message:string , successs:boolean , data ? : {companies:ICompany[] | null,totalPages:number} , statusCode : number}>
    companyStatusChange(email : string ,isBlock : boolean)  : Promise<IBaseResponse>
    updateProfileImage (email : string , imageUrl : string) : Promise<IUpdateProfileImage>
    
}