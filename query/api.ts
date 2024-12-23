import { AxiosInstance } from 'axios';

export async function reportError(axios: AxiosInstance, message: string) {
  try {
    const result = await axios.post('/error', { message });

    console.log({ fuck: message });

    return result.data;
  } catch {
    // Ignore
  }
}
