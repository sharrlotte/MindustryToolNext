import { AxiosInstance } from 'axios';

export default async function putRemovePost(
  axios: AxiosInstance,
  id: string,
): Promise<string> {
  const result = await axios.put(`/posts/${id}`);

  return result.data;
}
