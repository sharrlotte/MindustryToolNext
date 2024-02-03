import { AxiosInstance } from 'axios';

export default async function getMapData(
  axios: AxiosInstance,
  id: string,
): Promise<string> {
  const result = await axios.get(`/maps/${id}/data`);

  return result.data;
}
