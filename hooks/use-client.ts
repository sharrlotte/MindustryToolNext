import env from '@/constant/env';
import RefreshTokenResponse from '@/types/response/RefreshTokenResponse';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const axiosClient = axios.create({
  baseURL: env.url.api,
  paramsSerializer: {
    indexes: null,
  },
});

export default function useClient() {
  const { data: session, update } = useSession();
  const accessToken = session?.user?.accessToken;
  const refreshToken = session?.user?.refreshToken;

  if (accessToken) {
    axiosClient.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    axiosClient.defaults.headers['Authorization'] = '';
  }

  const addRefreshInterceptor = () => {
    const refreshInterceptor = axiosClient.interceptors.response.use(
      async (response) => response,
      async (error) => {
        if (error.response.status !== 401) {
          return Promise.reject(error);
        }
        // Avoid loop
        axiosClient.interceptors.response.eject(refreshInterceptor);

        if (!refreshToken) {
          return Promise.reject(error);
        }

        return axiosClient
          .post('/auth/refresh-token', {
            refreshToken: refreshToken,
          })
          .then((response) => {
            const { accessToken, refreshToken }: RefreshTokenResponse =
              response.data;

            update({
              user: { accessToken, refreshToken },
            });

            console.log({
              message: 'Refresh token',
              accessToken,
              refreshToken,
            });

            error.response.config.headers['Authorization'] =
              'Bearer ' + accessToken;

            return axios(error.response.config);
          })
          .catch((error2) => {
            update({
              user: {
                accessToken: '',
                refreshToken: '',
              },
            });

            Promise.reject(error2);
          })
          .finally(addRefreshInterceptor);
      },
    );
  };

  addRefreshInterceptor();

  return axiosClient;
}
