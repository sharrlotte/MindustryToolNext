import { LogCollection } from '@/constant/enum';
import Pageable from '@/types/data/pagable-schema';
import { Log } from '@/types/response/Log';
import { AxiosInstance } from 'axios';

type GetLogParams = Pageable & {
  collection: LogCollection;
};

export default async function getLogs(
  axios: AxiosInstance,
  { collection, page }: GetLogParams,
): Promise<Log[]> {
  const result = await axios.get(`logs/${collection}`, {
    params: {
      page,
      items: 20,
    },
  });

  return result.data;
}
