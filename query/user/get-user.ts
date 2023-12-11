import axiosClient from '@/query/config/axios-config';
import { IdSearchParams } from '@/schema/search-id-schema';
import User from '@/types/response/User';

export default async function getPosts({ id }: IdSearchParams): Promise<User> {
  const result = await axiosClient.get(`/users/${id}`);

  return result.data;
}
