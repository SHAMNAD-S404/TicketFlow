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

export const fetchAllTickets = async (currentPage : number, sortBy : string, searchQuery:string ) => {
    try {

        const response = await axiosInstance.get(
            `/tickets/get-all-tickets?page=${currentPage}&sortBy=${sortBy}&searchQuery=${searchQuery}`
        );
        return response.data;
        
    } catch (error) {
        console.error(error);
        throw error
    }
}
