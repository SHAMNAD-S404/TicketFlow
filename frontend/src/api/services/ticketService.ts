import axiosInstance from "../axiosInstance";


export const createTicket = async ( data : FormData) => {
    try {

        const response = await axiosInstance.post("/tickets/create-ticket",data,{
            headers : {
                "Content-Type": "multipart/form-data",
            }
        });
        return response.data
        
    } catch (error) {
        throw error
    }
}
