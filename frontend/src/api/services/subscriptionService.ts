import { IHandlePurchaseData } from "@/interfaces/IPurchaseData";
import axiosInstance from "../axiosInstance";

export const createCheckoutSession = async (data: IHandlePurchaseData) => {
  try {
    const response = await axiosInstance.post("/subscription/create-checkout-session", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderDetails = async (sessionId: string) => {
  try {
    const response = await axiosInstance.get(`/subscription/get-order-details?sessionId=${sessionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//for fetching all the purchase histories
export const fetchPurchaseHistory = async () => {
  try {
    const response = await axiosInstance.get(`/subscription/get-purchase-history`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//get all order statics 
export const fetchSubscriptionStatics = async () => {
    try {
        const response = await axiosInstance.get('/subscription/get-subscription-statics');
        return response.data;
    } catch (error) {
        throw error;
    }
}
