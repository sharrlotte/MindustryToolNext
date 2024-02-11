import { AxiosInstance } from 'axios';

export default async function putRemoveSchematic(
  axios: AxiosInstance,
  id: string,
): Promise<string> {
  const result = await axios.put(`/schematics/${id}`);

  return result.data;
}
