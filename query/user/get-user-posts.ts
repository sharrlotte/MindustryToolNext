import {
  PaginationSearchQuery,
  searchSchema,
} from '@/types/data/pageable-search-schema';
import { Post } from '@/types/response/Post';
import { AxiosInstance } from 'axios';

export default async function getUserPosts(
  axios: AxiosInstance,
  userId: string,
  params: PaginationSearchQuery,
): Promise<Post[]> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get(`/users/${userId}/posts`, {
    params: searchParams,
  });

  return result.data;
}
