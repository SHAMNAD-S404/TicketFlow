import { ICompany } from "../../models/interface/IcompanyModel";


export interface ICompanyService  {
    createCompany(companyData : ICompany): Promise<{message : string,data?:ICompany, success : boolean}>;
}