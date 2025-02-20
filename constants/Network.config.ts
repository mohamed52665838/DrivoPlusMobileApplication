import axios from "axios"

const BASE_URL = 'http://192.168.16.144:5000'
const requester = axios.create({baseURL: BASE_URL})
requester.interceptors.request.use(
  (config) => {
    console.log("Sending Request:", config.method?.toUpperCase(), config.url);
    console.log("Headers:", config.headers);
    console.log("Body:", config.data);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);
export default requester
