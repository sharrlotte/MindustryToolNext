import { AxiosInstance } from 'axios';

import { UserLoginHistory } from '@/types/response/UserLoginHistory';
import { PaginationQuery } from '@/query/search-query';

export async function getLoginHistories(axios: AxiosInstance, params: PaginationQuery): Promise<UserLoginHistory[]> {
  const result = await axios.get('/user-login-histories', {
    params,
  });

  return result.data;
}
