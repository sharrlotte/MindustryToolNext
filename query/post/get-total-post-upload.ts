import {
  PaginationSearchQuery,
  searchSchema,
} from '@/types/data/pageable-search-schema';
import { AxiosInstance } from 'axios';

export default async function getTotalPostUpload(
  axios: AxiosInstance,
  params: PaginationSearchQuery,
): Promise<number> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get('/posts/total/upload', {
    params: { ...searchParams },
  });

  return result.data;
}
