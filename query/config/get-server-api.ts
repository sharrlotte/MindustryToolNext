import 'server-only';
import { auth } from '@/auth/config';
import { APIInstance } from '@/hooks/use-client';
import axiosInstance from '@/query/config/config';

const getServerAPI = async (): Promise<APIInstance> => {
  const session = await auth();
  const accessToken = session?.user?.accessToken;

  if (accessToken) {
    axiosInstance.defaults.headers['Authorization'] = accessToken;
  } else {
    axiosInstance.defaults.headers['Authorization'] = '';
  }

  return { axios: axiosInstance, enabled: true };
};

export default getServerAPI;
