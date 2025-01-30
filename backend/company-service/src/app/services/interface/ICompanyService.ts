import { ICompany } from "../../models/interface/IcompanyModel";


export interface ICompanyService  {
    createCompany(companyData : ICompany): Promise<{message : string,data?:ICompany, success : boolean}>;
    fetchCompanyData(userId : string) : Promise<{message : string, data?:ICompany,success:boolean}>
    getCompanyIdWithAuthUserUUID(userUUID:string) : Promise<string>;
    getCompanyUpdateProfile(email:string, upateData : Partial<ICompany>) : Promise<{message : string , success : boolean , data ? : ICompany}>
}