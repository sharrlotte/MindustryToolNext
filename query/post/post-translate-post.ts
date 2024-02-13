import { toForm } from '@/lib/utils';
import TranslatePostRequest from '@/types/request/TranslatePostRequest';
import { AxiosInstance } from 'axios';

export default async function postTranslatePost(
  axios: AxiosInstance,
  { id, ...rest }: TranslatePostRequest,
): Promise<void> {
  const form = toForm(rest);

  return axios.post(`/posts/${id}/translate`, form, {
    data: form,
  });
}
