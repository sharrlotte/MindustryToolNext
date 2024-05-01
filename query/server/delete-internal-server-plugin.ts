import { AxiosInstance } from 'axios';

export default async function deleteInternalServerPlugin(
  axios: AxiosInstance,
  id: string,
  pluginId: string,
): Promise<void> {
  const result = await axios.delete(
    `/internal-servers/${id}/plugins/${pluginId}`,
  );

  return result.data;
}
