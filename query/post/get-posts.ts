import { SearchParams, searchSchema } from '@/types/data/search-schema';
import Post from '@/types/response/Post';
import { AxiosInstance } from 'axios';

export default async function getPosts(axios: AxiosInstance, params: SearchParams): Promise<Post[]> {
  const searchParams = searchSchema.parse(params);
  const result = await axios.get('/posts', {
    params: { ...searchParams, items: 20 },
  });

  return result.data;
}
