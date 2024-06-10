import { AxiosInstance } from 'axios';

import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import { Post } from '@/types/response/Post';

export default async function getPostUploads(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<Post[]> {
  const result = await axios.get('/posts/upload', {
    params,
  });

  return result.data;
}
