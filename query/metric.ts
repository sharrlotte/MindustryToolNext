import { AxiosInstance } from 'axios';

import { MetricType } from '@/constant/enum';
import { Metric } from '@/types/response/Metric';

export async function getMetric(axios: AxiosInstance, start: Date, end: Date, collection: MetricType): Promise<Metric[]> {
  return axios
    .get('metrics', {
      params: {
        start: start.toISOString(),
        end: end.toISOString(),
        collection: collection,
      },
    })
    .then((result) =>
      result.data.map((v: any) => {
        const createdAt = new Date(v.createdAt);
        return { ...v, createdAt };
      }),
    );
}
