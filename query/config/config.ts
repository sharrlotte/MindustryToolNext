import Axios from 'axios';

import env from '@/constant/env';

const axiosInstance = Axios.create({
  baseURL: env.url.api,
  paramsSerializer: {
    indexes: null,
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.errno === -4078) {
      throw new Error('Service is unavailable, please try again later');
    }

    if (error?.response?.data) {
      throw {
        message: error.response.data.message,
        status: error.response.data.status,
      };
    }

    throw error;
  },
);

axiosInstance.interceptors.request.use((req) => {
  console.log(req.url);
  return req;
});

export default axiosInstance;
