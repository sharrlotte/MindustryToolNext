import { AxiosInstance } from 'axios';

import { Message } from '@/types/response/Message';
import { User } from '@/types/response/User';

export async function getMessages(
  axios: AxiosInstance,
  room: string,
  params: {
    cursor: string;
    size: number;
  },
): Promise<Message[]> {
  return axios.get(`rooms/${room}/messages`, { params }).then((result) => result.data);
}
export async function getMembers(
  axios: AxiosInstance,
  room: string,
  params: {
    page: number;
    size: number;
  },
): Promise<User[]> {
  return axios.get(`rooms/${room}/members`, { params }).then((result) => result.data);
}

export async function getLastMessage(axios: AxiosInstance, room: string): Promise<Message> {
  return axios.get(`rooms/${room}/last-message`).then((result) => result.data);
}
