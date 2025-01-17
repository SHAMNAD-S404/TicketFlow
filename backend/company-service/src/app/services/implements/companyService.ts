import { ICompany } from "../../models/interface/IcompanyModel";
import CompanyRepository from "../../repositories/implements/company"
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
    async createCompany(companyData : ICompany) : Promise<{message : string,data?:ICompany, success : boolean}> {
        try {
            // check if company with the same email already exists
            const existingCompany = await CompanyRepository.findByEmail(companyData.email);
            if(existingCompany){
                return {message: "company with this email id already exists",success:false}
            }

            // create the company
            const newCompany = await CompanyRepository.createCompany(companyData);
            if (!newCompany) {
                return {message:"Failed to create company",success:false}
            } else {
                return {message:"company created successfully",data:newCompany,success:true}
            }
            
            
        } catch (error) {
            return {message : String(error),success:false}
        }
    }
}
