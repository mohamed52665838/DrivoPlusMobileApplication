import axios from "axios"

const ipAdress = "192.168.179.144"
const webPort = 5000
const webSocketPort = 8085


const BASE_URL = `http://${ipAdress}:${webPort}`
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

export {ipAdress, webPort, webSocketPort}
export default requester
