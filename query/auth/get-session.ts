import getServerAPI from '@/query/config/get-server-api';
import { Session } from '@/types/response/Session';

export default async function getSession(): Promise<Session> {
  const result = await getServerAPI().then((api) =>
    api.axios.get('/auth/session'),
  );

  return result.data;
}
