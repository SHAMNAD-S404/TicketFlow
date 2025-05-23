import CompanyService from "../../app/services/implements/companyService";
import { Messages } from "../../constants/messageConstants";

const companyService = new CompanyService();

export interface IComapnyStatus {
  email: string;
  isBlock: boolean;
  eventType: string;
}

export interface ISubsriptionUpdate {
  eventType: string;
  companyUUID: string;
  subscriptionPlan: string;
  subscriptionEndDate: string;
  isSubscriptionExpired: boolean;
}

export const companyStatusUpdate = async (data: IComapnyStatus) => {
  try {
    const updateCompany = await companyService.companyStatusChange(data.email, data.isBlock);
    console.log(updateCompany);
  } catch (error) {
    console.error("Errro in company status update event  : ", error);
  }
};

export const companySubscriptionUpdate = async (data: ISubsriptionUpdate) => {
  try {
    const { companyUUID, isSubscriptionExpired, subscriptionEndDate, subscriptionPlan } = data;
    const updateSubsStatus = await companyService.updateCompanyService(
      { authUserUUID: companyUUID },
      { subscriptionPlan, subscriptionEndDate, isSubscriptionExpired }
    );
    console.log("company updated", updateSubsStatus);
  } catch (error) {
    console.log(`${Messages.COMPANY_SUBS_UPDATE_ERROR} :`, error);
  }
};
