import { AxiosInstance } from 'axios';

import { Message } from '@/types/response/Message';

export async function getMessages(
  axios: AxiosInstance,
  params: {
    cursor: string;
    size: number;
    room: string;
  },
): Promise<Message[]> {
  return axios.get('/messages', { params }).then((result) => result.data);
}
