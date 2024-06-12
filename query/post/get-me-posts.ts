import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { Post } from '@/types/response/Post';

export default async function getMePosts(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<Post[]> {
  const result = await axios.get('users/@me/posts', {
    params,
  });

  return result.data;
}
