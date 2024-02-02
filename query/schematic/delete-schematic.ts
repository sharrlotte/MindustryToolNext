import { AxiosInstance } from 'axios';

export default async function deleteSchematic(
  axios: AxiosInstance,
  id: string,
): Promise<void> {
  const result = await axios.delete(`/schematics/${id}`);

  return result.data;
}
