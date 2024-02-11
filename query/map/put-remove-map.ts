import { AxiosInstance } from 'axios';

export default async function putRemoveMap(
  axios: AxiosInstance,
  id: string,
): Promise<string> {
  const result = await axios.put(`/maps/${id}`);

  return result.data;
}
