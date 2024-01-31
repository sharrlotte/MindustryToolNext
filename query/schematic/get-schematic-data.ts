import { AxiosInstance } from 'axios';

export default async function getSchematicData(
  axios: AxiosInstance,
  id: string,
): Promise<string> {
  const result = await axios.get(`/schematics/${id}/data`);

  return result.data;
}
