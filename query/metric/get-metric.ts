import { Metric } from '@/types/response/Metric';
import { AxiosInstance } from 'axios';

type MetricCollection = 'daily_like' | 'daily_user' | 'logged_daily_user';

export default async function getMetric(
  axios: AxiosInstance,
  start: Date,
  end: Date,
  collection: MetricCollection,
): Promise<Metric[]> {
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
        let time = new Date(v.time);
        return { value: v.value, time };
      }),
    );
}
