import { IHandlePurchaseData } from "@/interfaces/IPurchaseData";
import axiosInstance from "../axiosInstance";

export const createCheckoutSession = async (data : IHandlePurchaseData ) => {
    try {
        const response = await axiosInstance.post("/subscription/create-checkout-session",data);
        return response.data
    } catch (error) {
        throw error;
    }
}