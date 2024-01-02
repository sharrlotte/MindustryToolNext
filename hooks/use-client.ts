import env from '@/constant/env';
import { toForm } from '@/lib/utils';
import { RefreshTokenResponse } from '@/types/response/RefreshTokenResponse';
import Axios, { AxiosInstance } from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Lock from '@/lib/lock';
import { useLocalStorage } from 'usehooks-ts';
import { Token } from '@/types/data/Token';

const lock = new Lock();

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
  const [isLoaded, setLoaded] = useState(false);
  const { data: session, status } = useSession();
  const [token, setToken] = useLocalStorage<Token | undefined>(
    'token',
    undefined,
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        setToken(undefined);
      }

      Promise.reject(error);
    },
  );

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      setLoaded(true);
      return;
    }

    axios.interceptors.request.use(async (request) => {
      if (request.url === `${env.url.api}/auth/refresh-token`) {
        return request;
      }

      await lock.await();
      lock.acquire();

      if (token) {
        const { refreshToken, expireTime } = token;

        if (expireTime !== 0 && expireTime > Date.now()) {
          lock.release();
          return request;
        }

        if (refreshToken) {
          try {
            const form = toForm({ refreshToken: refreshToken });
            const data: RefreshTokenResponse = await axios
              .post(`${env.url.api}/auth/refresh-token`, form)
              .then((result) => result.data);

            setToken(data);
            console.log('Refresh when request');

            request.headers['Authorization'] = 'Bearer ' + data.accessToken;
          } catch {
            setToken(undefined);
          } finally {
            lock.release();
          }
        } else {
          request.headers['Authorization'] = '';
        }
        lock.release();
      }

      return request;
    });

    if (!token) {
      const accessToken = session?.user?.accessToken ?? '';
      const refreshToken = session?.user?.refreshToken ?? '';
      const expireTime = session?.user?.expireTime ?? 0;

      if (accessToken && refreshToken && expireTime) {
        if (expireTime < Date.now()) {
          setToken({ accessToken, refreshToken, expireTime });
        } else {
          const form = toForm({ refreshToken: refreshToken });
          axios
            .post(`${env.url.api}/auth/refresh-token`, form)
            .then((result) => result.data as RefreshTokenResponse)
            .then((data) => setToken(data))
            .then(() => console.log('Refresh on load'));
        }
      } else {
        setToken(undefined);
        signOut();
        setLoaded(true);
      }
    } else {
      axios.defaults.headers['Authorization'] = 'Bearer ' + token.accessToken;
      setLoaded(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, token]);

  return { axios, enabled: status !== 'loading' && isLoaded };
}
