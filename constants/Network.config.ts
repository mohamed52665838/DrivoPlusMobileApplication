import axios from "axios"

const IP_ADRESS = "192.168.1.16";
const PORT = 5050;
const WS_PORT = 5643;

const BASE_URL = `http://${IP_ADRESS}:${PORT}`
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

export {IP_ADRESS, WS_PORT, PORT}
export default requester