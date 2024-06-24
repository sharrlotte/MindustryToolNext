import { AxiosInstance } from 'axios';

import { IdSearchParams } from '@/types/data/id-search-schema';
import { User } from '@/types/response/User';

const defaultIds = ['server', 'bot', 'community'] as const;

export default async function getUser(
  axios: AxiosInstance,
  { id }: IdSearchParams,
): Promise<User> {
  //@ts-ignore
  if (defaultIds.includes(id.toLowerCase())) {
    switch (id.toLowerCase()) {
      case 'server':
        return {
          id: 'server',
          name: 'Server',
          imageUrl: null,
          roles: ['SERVER'],
        };

      case 'bot':
        return {
          id: 'bot',
          name: 'Bot',
          imageUrl: null,
          roles: ['BOT'],
        };

      case 'community':
        return {
          id: 'community',
          name: 'Community',
          imageUrl: null,
          roles: [],
        };
    }
  }

  const result = await axios.get(`/users/${id}`);

  return result.data;
}
