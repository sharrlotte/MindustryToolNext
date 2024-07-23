'use client';

import { AxiosInstance } from 'axios';
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import LoadingSpinner from '@/components/common/loading-spinner';
import { fillMetric } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import getMetric from '@/query/metric/get-metric';

import { useQueries } from '@tanstack/react-query';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const NUMBER_OF_DAY = 15;

type ChartProps = {
  axios: AxiosInstance;
  start: Date;
  end: Date;
};

export default function ClientChart(props: ChartProps) {
  const t = useI18n();
  return (
    <div className="rounded-lg bg-card flex w-full flex-col h-full gap-2 p-2 aspect-[2/1.5]">
      <span className="font-bold">Client</span>
      <Loading {...props} />
    </div>
  );
}

function Loading({ axios, start, end }: ChartProps) {
  const [loggedDailyUser, dailyUser] = useQueries({
    queries: [
      {
        queryFn: () => getMetric(axios, start, end, 'DAILY_WEB_USER'),
        queryKey: ['daily_web_user'],
      },
      {
        queryFn: () => getMetric(axios, start, end, 'DAILY_MOD_USER'),
        queryKey: ['daily_mod_user'],
      },
    ],
  });

  if (loggedDailyUser.isLoading || dailyUser.isLoading) {
    return <LoadingSpinner className="h-full aspect-[2/1.5]" />;
  }

  if (loggedDailyUser.error || dailyUser.error)
    return (
      <span>{loggedDailyUser.error?.message || dailyUser.error?.message}</span>
    );

  let fixedLoggedDaily = fillMetric(
    start,
    NUMBER_OF_DAY,
    loggedDailyUser.data,
    0,
  );

  let fixedDaily = fillMetric(start, NUMBER_OF_DAY, dailyUser.data, 0);

  const data: ChartData<'line'> = {
    labels: fixedLoggedDaily.map(({ createdAt }) => createdAt),
    datasets: [
      {
        label: 'Web user',
        data: fixedDaily.map(({ value }) => value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Mod user',
        data: fixedLoggedDaily.map(({ value }) => value),
        borderColor: 'rgb(99, 255, 132)',
        backgroundColor: 'rgba(99, 255, 132)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="h-full">
      <Line
        options={{
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
        }}
        data={data}
      />
    </div>
  );
}
