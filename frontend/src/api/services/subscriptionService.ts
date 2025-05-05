import { IHandlePurchaseData } from "@/interfaces/IPurchaseData";
import axiosInstance from "../axiosInstance";

export const createCheckoutSession = async (data: IHandlePurchaseData) => {
  const response = await axiosInstance.post("/subscription/create-checkout-session", data);
  return response.data;
};

export const getOrderDetails = async (sessionId: string) => {
  const response = await axiosInstance.get(`/subscription/get-order-details?sessionId=${sessionId}`);
  return response.data;
};

//for fetching all the purchase histories
export const fetchPurchaseHistory = async () => {
  const response = await axiosInstance.get(`/subscription/get-purchase-history`);
  return response.data;
};

//get all order statics
export const fetchSubscriptionStatics = async () => {
  const response = await axiosInstance.get("/subscription/get-subscription-statics");
  return response.data;
};
