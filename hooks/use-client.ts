import env from '@/constant/env';
import Axios, { AxiosInstance } from 'axios';
import { useSession } from 'next-auth/react';

const axios = Axios.create({
  baseURL: env.url.api,
  paramsSerializer: {
    indexes: null,
  },
});

export type APIInstance = {
  axios: AxiosInstance;
  enabled: boolean;
};

export default function useClientAPI(): APIInstance {
  const { data: session, status, update } = useSession();
  const accessToken = session?.user?.accessToken;
  const refreshToken = session?.user?.refreshToken;

  if (accessToken) {
    axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

    const createAxiosResponseInterceptor = () => {
      const interceptor = axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response.status !== 401) {
            return Promise.reject(error);
          }

          axios.interceptors.response.eject(interceptor);

          return axios
            .post(`${env.url.api}/auth/refresh_token`, {
              refresh_token: refreshToken,
            })
            .then((response) => {
              error.response.config.headers['Authorization'] =
                'Bearer ' + response.data.access_token;

              update({
                user: {
                  accessToken: response.data.access_token,
                  refreshToken: response.data.refreshToken,
                },
              });

              return axios(error.response.config);
            })
            .catch((error2) => {
              return Promise.reject(error2);
            })
            .finally(createAxiosResponseInterceptor);
        },
      );
    };
    createAxiosResponseInterceptor();
  } else {
    axios.defaults.headers['Authorization'] = '';
  }

  return { axios, enabled: status !== 'loading' };
}
