import axios from "axios";
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from "./interceptors";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials : true, 
});

console.log("heloo")

setupResponseInterceptor(axiosInstance);

const enableInterceptors = false;

if (enableInterceptors) {
  setupRequestInterceptor(axiosInstance);
  setupResponseInterceptor(axiosInstance);
}

export default axiosInstance;
