import { AxiosInstance } from 'axios';

import { PaginationQuery } from '@/query/search-query';
import { Notification } from '@/types/response/Notification';

export async function getMyNotifications(axios: AxiosInstance, params: PaginationQuery): Promise<Notification[]> {
  const result = await axios.get(`/notifications`, { params });

  return result.data;
}
export async function getMyUnreadNotificationCount(axios: AxiosInstance): Promise<number> {
  const result = await axios.get(`/notifications/count`);

  return result.data;
}

export async function markAsRead(axios: AxiosInstance): Promise<void> {
  const result = await axios.put(`/notifications`);

  return result.data;
}

export async function markAsReadById(axios: AxiosInstance, id: string): Promise<void> {
  const result = await axios.put(`/notifications/${id}`);

  return result.data;
}

export async function deleteNotification(axios: AxiosInstance, id: string): Promise<void> {
  const result = await axios.delete(`/notifications/${id}`);

  return result.data;
}

export async function deleteAllNotifications(axios: AxiosInstance): Promise<void> {
  const result = await axios.delete(`/notifications`);

  return result.data;
}
