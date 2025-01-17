import { BaseRepository } from "./baseRepository";
import { ICompanyRepository } from "../interface/IcompanyRepo";
import { ICompany } from "../../models/interface/IcompanyModel";
import CompanyModel from "../../models/implements/company";


class CompanyRepository extends BaseRepository<ICompany> implements ICompanyRepository {
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

    async findByEmail(email:string) : Promise<ICompany | null> {
        try {
            return await this.findOne(email);
            
        } catch (error) {
            throw error;
        }
    }




}

export default new CompanyRepository();
