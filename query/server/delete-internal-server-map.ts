import { AxiosInstance } from 'axios';

export default async function deleteInternalServerMap(
  axios: AxiosInstance,
  id: string,
  mapId: string,
): Promise<void> {
  const result = await axios.delete(`/internal-servers/${id}/maps/${mapId}`);

  return result.data;
}
