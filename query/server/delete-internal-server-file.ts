import { AxiosInstance } from 'axios';

export default async function deleteServerFile(
  axios: AxiosInstance,
  id: string,
  path: string,
): Promise<void> {
  const result = await axios.delete(`/internal-servers/${id}/files`, {
    params: { path },
  });

  return result.data;
}
