import { AxiosInstance } from 'axios';

export async function reportError(axios: AxiosInstance, data: { error: any; path: string }) {
  const { error, path } = data;

  if (typeof error === 'object' && 'error' in error && 'status' in error.error && error.error.status === 503) {
    return;
  }

  const result = await axios.post('/error', { error: JSON.stringify(error), path });

  return result.data;
}
