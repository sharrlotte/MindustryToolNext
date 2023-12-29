'use client';

import { NUMBER_OF_DAY, background, chart } from '@/app/[locale]/admin/page';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { APIInstance } from '@/hooks/use-client';
import { fillMetric } from '@/lib/utils';
import getMetric from '@/query/metric/get-metric';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
} from 'recharts';

type ChartProps = {
  axios: APIInstance;
  start: Date;
  end: Date;
};

export default function LikeChart({
  axios: { axios, enabled },
  start,
  end,
}: ChartProps) {
  const {
    data: metric,
    error,
    isLoading,
  } = useQuery({
    queryFn: () => getMetric(axios, start, end, 'daily_like'),
    queryKey: ['daily_like'],
    enabled,
  });

  if (isLoading) {
    return (
      <div className={background}>
        <span className="font-bold">User interaction</span>
        <LoadingSpinner className={chart} />
      </div>
    );
  }

  if (error) return <span>{error?.message}</span>;

  const data = fillMetric(start, NUMBER_OF_DAY, metric, 0);

  return (
    <div className={background}>
      <span className="font-bold">User interaction</span>
      <div className={chart}>
        <ResponsiveContainer width="99%" height="99%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            <XAxis allowDecimals={false} dataKey="time" />
            <YAxis allowDecimals={false} dataKey="value" />
            <Tooltip />
            <Line
              name="Value"
              type="monotone"
              fill="currentColor"
              dataKey="value"
              strokeWidth={2}
              stroke="#8884d8"
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
