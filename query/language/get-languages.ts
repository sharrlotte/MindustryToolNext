import { AxiosInstance } from 'axios';

export default async function getLanguages(
  axios: AxiosInstance,
): Promise<string[]> {
  const result = await axios.get(`/languages`);

  return result.data;
}
