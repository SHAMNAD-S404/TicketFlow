import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";


export const setupRequestInterceptor = (axiosInstance : any) => {
    axiosInstance.interceptors.request.use(
        (config : AxiosRequestConfig ) => {
            const token = localStorage.getItem("tokename");
            // if(token){
            //     config.headers.Authorization = `Bearer &{token}`;
            // }
            return config;
        },
        (error : AxiosError) => Promise.reject(error)
    )
}

export const setupResponseInterceptor = (axiosInstance: any) => {
    axiosInstance.interceptors.response.use(
      (response :AxiosResponse) => response, 
      (error : AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized errors (token expiry, etc.)
          console.error('Unauthorized! Redirecting to login...');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  };