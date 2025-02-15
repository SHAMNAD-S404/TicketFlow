import {ICompany} from '../../models/interface/IcompanyModel'
import { IBaseRepository } from './IBaseRepository';

export interface ICompanyRepository extends IBaseRepository<ICompany> {
    createCompany(company: ICompany): Promise<ICompany>;
    findByAuthUserUUID(authUserUUID: string): Promise<ICompany | null>;
    findOneByEmail(email: string): Promise<ICompany | null>;
    updateProfileByEmail(email:string,updateData:Partial<ICompany>) : Promise<ICompany|null>;
    findAllCompany() : Promise<ICompany[] | null>;
}
