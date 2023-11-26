import cfg from "@/constant/global";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: cfg.apiUrl,
  paramsSerializer: {
    indexes: null
  }
});

export default axiosClient;
