import { PaginationQuery } from '@/types/data/pageable-search-schema';
import MindustryServer from '@/types/response/MindustryServer';
import { AxiosInstance } from 'axios';

export default async function getServers(
  axios: AxiosInstance,
  params: PaginationQuery,
): Promise<MindustryServer[]> {
  const result = await axios.get(`/mindustry-servers`, {
    params: {
      ...params,
      items: 40,
    },
  });

  return result.data;
}
