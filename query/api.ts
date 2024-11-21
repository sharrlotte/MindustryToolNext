import { AxiosInstance } from 'axios';

import { getErrorMessage } from '@/lib/utils';

export async function reportError(axios: AxiosInstance, data: { error: any; path: string }) {
  const { error, path } = data;

  const message = getErrorMessage(error);

  const result = await axios.post('/error', { error: message + '\n' + JSON.stringify(error, Object.getOwnPropertyNames(error)), path });

  return result.data;
}
