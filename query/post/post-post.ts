import { AxiosInstance } from 'axios';
import PostPostRequest from '@/types/request/PostPostRequest';
import { toForm } from '@/lib/utils';

export default async function postPost(
  axios: AxiosInstance,
  { content, ...data }: PostPostRequest,
): Promise<void> {
  const form = toForm(data);

  form.append('content', content.text);

  content.images.forEach(({ file, url }) => form.append('images', file, url));

  return axios.post('/posts', form, {
    data: form,
  });
}
