import { AxiosInstance } from 'axios';

export async function reportErrorToBackend(axios: AxiosInstance, message: string) {
  
  try {
    const result = await axios.post('/error', { message });

    return result.data;
  } catch {
    // Ignore
  }
}
