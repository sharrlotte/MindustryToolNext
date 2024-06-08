import { LogCollection } from '@/constant/enum';
import Pageable from '@/types/data/pagable-schema';
import { Log } from '@/types/response/Log';

import { AxiosInstance } from 'axios';

type GetLogParams = Pageable & {
  collection: LogCollection;
  env?: 'Prod' | 'Dev';
};

export default async function getLogs(
  axios: AxiosInstance,
  { collection, page, ...rest }: GetLogParams,
): Promise<Log[]> {
  const params = Object.fromEntries(
    Object.entries(rest).filter(([_, value]) => value),
  );

  const result = await axios.get(`logs/${collection}`, {
    params: {
      items: 20,
      page,
      ...params,
    },
  });

  return result.data;
}
