import env from '@/constant/env';
import Axios from 'axios';
import { notFound } from 'next/navigation';

export class RestApiError extends Error {
  message: string;
  status: number;

  constructor(message: string, status: number) {
    super();
    this.message = message;
    this.status = status;
  }
}

const axiosInstance = Axios.create({
  baseURL: env.url.api,
  paramsSerializer: {
    indexes: null,
  },
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.data) {
      throw new RestApiError(
        error.response.data.message,
        error.response.data.status,
      );
    }

    throw error;
  },
);

export default axiosInstance;
