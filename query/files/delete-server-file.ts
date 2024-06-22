import { AxiosInstance } from 'axios';

export default async function deleteServerFile(
  axios: AxiosInstance,
  path: string,
): Promise<void> {
  const result = await axios.delete(`/files`, {
    params: { path },
  });

  return result.data;
}
