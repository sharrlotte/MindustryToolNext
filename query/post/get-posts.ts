import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { Post } from '@/types/response/Post';

export default async function getPosts(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<Post[]> {
  const result = await axios.get('/posts', {
    params,
  });

  return result.data;
}
