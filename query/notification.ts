import { AxiosInstance } from 'axios';

import { PaginationQuery } from '@/types/data/pageable-search-schema';
import { Notification } from '@/types/response/Notification';

export async function getMyNotifications(axios: AxiosInstance, params: PaginationQuery): Promise<Notification[]> {
  const result = await axios.get(`/notifications`, { params });

  return result.data;
}
export async function getMyUnreadNotificationCount(axios: AxiosInstance): Promise<number> {
  const result = await axios.get(`/notifications/count`);

  return result.data;
}
