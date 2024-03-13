import { LogCollection } from '@/constant/enum';
import Pageable from '@/types/data/pagable-schema';
import { Log } from '@/types/response/Log';
import { AxiosInstance } from 'axios';

type GetLogParams = Pageable & {
  collection: LogCollection;
  env: 'Prod' | 'Dev' | undefined;
};

export default async function getLogs(
  axios: AxiosInstance,
  { collection, page, env }: GetLogParams,
): Promise<Log[]> {
  const result = await axios.get(`logs/${collection}`, {
    params: {
      page,
      items: 20,
      env,
    },
  });

  return result.data;
}
