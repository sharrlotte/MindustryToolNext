import { AxiosInstance } from 'axios';

export async function reportError(axios: AxiosInstance, data: { error: any; path: string }) {
  const { error, path } = data;

  const result = await axios.post('/error', { error: JSON.stringify(error), path });

  return result.data;
}
