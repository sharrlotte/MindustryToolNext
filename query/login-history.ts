import { AxiosInstance } from 'axios';

import { PaginationQuerySchema } from '@/query/search-query';
import { UserLoginHistory } from '@/types/response/UserLoginHistory';

export async function getLoginHistories(axios: AxiosInstance, params: PaginationQuery): Promise<UserLoginHistory[]> {
  const result = await axios.get('/user-login-histories', {
    params,
  });

  return result.data;
}
