import { AxiosInstance } from 'axios';

import { IdSearchParams } from '@/types/data/id-search-schema';
import { User } from '@/types/response/User';

export default async function getUser(
  axios: AxiosInstance,
  { id }: IdSearchParams,
): Promise<User> {
  const result = await axios.get(`/users/${id}`);

  return result.data;
}
