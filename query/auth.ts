import { AxiosInstance } from 'axios';

export async function verifyPlayer(axios: AxiosInstance, token: string) {
  const result = await axios.post('/auth/verify-uuid', { token });

  return result.data;
}
