import { AxiosInstance } from 'axios';

export default async function deleteDocument(
  axios: AxiosInstance,
  id: string,
): Promise<void> {
  const result = await axios.delete(`/documents/${id}`);

  return result.data;
}
