import { IHandlePurchaseData } from "@/interfaces/IPurchaseData";

// Helper function to validate purchase data
export const validatePurchaseData = (data: IHandlePurchaseData): { isValid: boolean; message: string } => {
    
  // Check each required field
  if (!data.authUserUUID) return { isValid: false, message: "User ID is missing" };
  if (!data.companyName) return { isValid: false, message: "Company name is missing" };
  if (!data.companyEmail) return { isValid: false, message: "Company email is missing" };
  if (!data.amount) return { isValid: false, message: "Amount is missing" };
  if (!data.plan) return { isValid: false, message: "Plan name is missing" };
  if (!data.planValidity) return { isValid: false, message: "Plan validity is missing" };
  if (!data.successUrl) return { isValid: false, message: "Success URL is missing" };
  if (!data.cancelUrl) return { isValid: false, message: "Cancel URL is missing" };
  if (!data.planStartDate) return { isValid: false, message: "Plan start date is missing" };
  if (!data.planEndDate) return { isValid: false, message: "Plan end date is missing" };


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.companyEmail)) {
    return { isValid: false, message: "Invalid email format" };
  }

  // Validate amount (should be a number)
  if (isNaN(Number(data.amount))) {
    return { isValid: false, message: "Amount should be a valid number" };
  }

  // All validations passed
  return { isValid: true, message: "" };
};
