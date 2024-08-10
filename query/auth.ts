import getServerAPI from '@/query/config/get-server-api';
import { Session } from '@/types/response/Session';

export async function getSession(): Promise<Session> {
  const result = await getServerAPI().then((api) => api.get('/auth/session'));

  return result.data;
}
