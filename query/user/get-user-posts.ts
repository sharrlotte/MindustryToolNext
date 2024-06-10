import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { Post } from '@/types/response/Post';

export default async function getUserPosts(
  axios: AxiosInstance,
  userId: string,
  params: PaginationSearchQuery,
): Promise<Post[]> {
  const result = await axios.get(`/users/${userId}/posts`, {
    params,
  });

  return result.data;
}
