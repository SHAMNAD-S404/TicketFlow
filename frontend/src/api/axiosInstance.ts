import axios from "axios";
import secrets from "@/config/secrets";
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from "./interceptors";

const axiosInstance = axios.create({
  baseURL: secrets.APIGATEWAY_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials : true, 
});


setupResponseInterceptor(axiosInstance);

const enableInterceptors = false;

if (enableInterceptors) {
  setupRequestInterceptor(axiosInstance);
  setupResponseInterceptor(axiosInstance);
}

export default axiosInstance;
