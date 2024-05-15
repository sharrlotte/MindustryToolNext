import { UserRole } from '@/constant/enum';
import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { User } from '@/types/response/User';
import { AxiosInstance } from 'axios';

export default async function getUsers(
  axios: AxiosInstance,
  params: PaginationQuery & { role: UserRole },
): Promise<User[]> {
  const result = await axios.get(`/users`, { params });

  return result.data;
}
