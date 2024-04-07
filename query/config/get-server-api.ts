import 'server-only';
import { auth } from '@/auth/config';
import { APIInstance } from '@/hooks/use-client';
import axiosInstance from '@/query/config/config';
import https from 'https';

const getServerAPI = async (): Promise<APIInstance> => {
  const session = await auth();
  const accessToken = session?.user?.accessToken;

  // TODO" Temp fix (try fix intermediate certificate)
  axiosInstance.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  if (accessToken) {
    axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + accessToken;
  } else {
    axiosInstance.defaults.headers['Authorization'] = '';
  }

  return { axios: axiosInstance, enabled: true };
};

export default getServerAPI;
