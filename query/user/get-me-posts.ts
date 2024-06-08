import {
  StatusPaginationSearchQuery,
  searchSchema,
} from '@/types/data/pageable-search-schema';
import { Post } from '@/types/response/Post';

import { AxiosInstance } from 'axios';

export default async function getMePosts(
  axios: AxiosInstance,
  params: StatusPaginationSearchQuery,
): Promise<Post[]> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get(`/users/@me/posts`, {
    params: searchParams,
  });

  return result.data;
}
