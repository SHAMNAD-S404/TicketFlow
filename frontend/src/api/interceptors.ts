import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export const setupRequestInterceptor = (axiosInstance: any) => {
  axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      //const token = localStorage.getItem("tokename");
      // if(token){
      //     config.headers.Authorization = `Bearer &{token}`;
      // }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );
};

export const setupResponseInterceptor = (axiosInstance: any) => {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await axiosInstance.post("/auth/refreshToken");
          return axiosInstance(originalRequest);
        } catch (error) {
          window.location.href = "/";
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};
