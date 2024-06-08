import { PaginationQuery } from '@/types/data/pageable-search-schema';
import UserLoginHistory from '@/types/response/UserLoginHistory';

import { AxiosInstance } from 'axios';

export default async function getLoginHistories(
  axios: AxiosInstance,
  params: PaginationQuery,
): Promise<UserLoginHistory[]> {
  const result = await axios.get('/user-login-histories', {
    params,
  });

  return result.data;
}
