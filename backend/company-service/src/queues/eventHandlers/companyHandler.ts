import CompanyService from "../../app/services/implements/companyService";


const companyService = new CompanyService();


export interface IComapnyStatus{
    email : string,
    isBlock : boolean,
    eventType : string,
}

export const companyStatusUpdate = async (data : IComapnyStatus) => {
    try {
        const updateCompany = await companyService.companyStatusChange(data.email,data.isBlock);      
        console.log(updateCompany)

    } catch (error) {
        console.error("Errro in company status update event  : ",error);
    }
}