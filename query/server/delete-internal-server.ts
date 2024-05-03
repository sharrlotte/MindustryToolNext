import { AxiosInstance } from 'axios';

export default async function deleteInternalServer(
  axios: AxiosInstance,
  id: string,
): Promise<void> {
  const result = await axios.delete(`/internal-servers/${id}`);

  return result.data;
}
