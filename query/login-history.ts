import { AxiosInstance } from 'axios';

import { PaginationQuery } from '@/query/search-query';
import { UserLoginHistory } from '@/types/response/UserLoginHistory';

export async function getLoginHistories(axios: AxiosInstance, params: PaginationQuery): Promise<UserLoginHistory[]> {
  const result = await axios.get('/user-login-histories', {
    params,
  });

  return result.data;
}
