import {ICompany} from '../../models/interface/IcompanyModel'
import { IBaseRepository } from './IBaseRepository';

export interface ICompanyRepository extends IBaseRepository<ICompany> {
    createCompany(company: ICompany): Promise<ICompany>;
    findByAuthUserId(userId: string): Promise<ICompany | null>;
    findOneByEmail(email: string): Promise<ICompany | null>;
}
