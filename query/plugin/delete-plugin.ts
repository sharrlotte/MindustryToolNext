import { AxiosInstance } from 'axios';

export default async function deletePlugin(
  axios: AxiosInstance,
  id: string,
): Promise<void> {
  const result = await axios.delete(`/plugins/${id}`);

  return result.data;
}
