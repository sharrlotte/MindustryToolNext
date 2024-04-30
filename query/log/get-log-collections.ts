import { AxiosInstance } from 'axios';

export default async function getLogCollections(
  axios: AxiosInstance,
): Promise<string[]> {
  const result = await axios.get(`logs`);

  return result.data;
}
