import { AxiosInstance } from 'axios';

export async function reportError(
  axios: AxiosInstance,
  data: { message: string; path: string },
) {
  const result = await axios.post('/error', data);

  return result.data;
}
