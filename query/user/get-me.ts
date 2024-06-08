import { User } from '@/types/response/User';

import { AxiosInstance } from 'axios';

export default async function getUser(axios: AxiosInstance): Promise<User> {
  const result = await axios.get(`/users/@me`);

  return result.data;
}
