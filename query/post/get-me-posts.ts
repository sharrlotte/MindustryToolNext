import {
  PaginationSearchQuery,
  searchSchema,
} from '@/types/data/pageable-search-schema';

import { Post } from '@/types/response/Post';
import { AxiosInstance } from 'axios';

export default async function getMePosts(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<Post[]> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get('users/@me/posts', {
    params: { ...searchParams, items: 20 },
  });

  return result.data;
}
