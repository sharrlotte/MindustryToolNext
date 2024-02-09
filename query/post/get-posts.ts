import {
  PaginationSearchQuery,
  searchSchema,
} from '@/types/data/pageable-search-schema';
import { PostPage } from '@/types/response/PostPage';
import { AxiosInstance } from 'axios';

export default async function getPosts(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<PostPage> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get('/posts', {
    params: { ...searchParams, items: 20 },
  });

  return result.data;
}
