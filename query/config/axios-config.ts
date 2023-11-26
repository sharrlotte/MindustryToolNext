import conf from "@/constant/global";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: conf.apiUrl,
  paramsSerializer: {
    indexes: null,
  },
});

export default axiosClient;
