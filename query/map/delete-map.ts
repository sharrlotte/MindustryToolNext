import { AxiosInstance } from 'axios';

export default async function deleteMap(
  axios: AxiosInstance,
  id: string,
): Promise<void> {
  const result = await axios.delete(`/maps/${id}`);

  return result.data;
}
