import { AxiosInstance } from 'axios';

export default async function deletePost(
  axios: AxiosInstance,
  id: string,
): Promise<void> {
  const result = await axios.delete(`/posts/${id}`);

  return result.data;
}
