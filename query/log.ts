import { AxiosInstance } from 'axios';

import { LogType } from '@/constant/enum';
import { LogPaginationQueryType } from '@/query/search-query';
import { Log } from '@/types/Log';

export async function getLogCollections(axios: AxiosInstance): Promise<string[]> {
  const result = await axios.get(`logs`);

  return result.data;
}

export async function getLogs(axios: AxiosInstance, { collection, page, ...rest }: LogPaginationQueryType): Promise<Log[]> {
  const params = Object.fromEntries(Object.entries(rest).filter(([_, value]) => value));

  const result = await axios.get(`logs/${collection}`, {
    params: {
      size: 20,
      page,
      ...params,
    },
  });

  return result.data;
}

export async function getLogCount(
  axios: AxiosInstance,
  {
    collection,
    ...rest
  }: {
    env?: string;
    ip?: string;
    userId?: string;
    url?: string;
    content?: string;
    before?: string;
    after?: string;
    collection: LogType;
  },
): Promise<number> {
  const params = Object.fromEntries(Object.entries(rest).filter(([_, value]) => value));

  const result = await axios.get(`logs/${collection}/count`, {
    params: {
      ...params,
    },
  });

  return result.data;
}
