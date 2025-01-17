import {ICompany} from '../../models/interface/IcompanyModel'
import { IBaseRepository } from './IBaseRepository';

export interface ICompanyRepository extends IBaseRepository<ICompany> {
    createCompany(company: ICompany): Promise<ICompany>;
    //findCompanyByEmail(email:string): Promise<ICompany | null>
}