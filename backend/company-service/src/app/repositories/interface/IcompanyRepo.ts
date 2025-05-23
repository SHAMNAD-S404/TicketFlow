import {ICompany} from '../../models/interface/IcompanyModel'
import { IBaseRepository } from './IBaseRepository';

export interface ICompanyRepository extends IBaseRepository<ICompany> {
    createCompany(company: ICompany): Promise<ICompany>;

    findByAuthUserUUID(authUserUUID: string): Promise<ICompany | null>;

    findOneByEmail(email: string): Promise<ICompany | null>;

    updateProfileByEmail(email:string,updateData:Partial<ICompany>) : Promise<ICompany|null>;

    findAllCompany(page:number,sort:string,searchKey:string) : Promise<{companies :ICompany[] | null , totalPages : number  }  >;

    updateCompanyStatus (email : string , isBlock :boolean) : Promise<ICompany |null >

    updateImageUrl (email :string, imageUrl : string) : Promise< string | null>
    
}
