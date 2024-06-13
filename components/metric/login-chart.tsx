'use client';

import { AxiosInstance } from 'axios';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import LoadingSpinner from '@/components/common/loading-spinner';
import { fillMetric } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import getMetric from '@/query/metric/get-metric';

import { useQueries } from '@tanstack/react-query';

const NUMBER_OF_DAY = 15;

const background =
  'rounded-lg bg-card p-2 flex w-full flex-col gap-2 p-2 h-[500px]';

const chart = 'h-[400px]';

type ChartProps = {
  axios: AxiosInstance;
  start: Date;
  end: Date;
};

export default function LoginChart(props: ChartProps) {
  const t = useI18n();
  return (
    <div className={background}>
      <span className="font-bold">{t('metric.user-login')}</span>
      <Loading {...props} />
    </div>
  );
}

function Loading({ axios, start, end }: ChartProps) {
  const [loggedDailyUser, dailyUser] = useQueries({
    queries: [
      {
        queryFn: () => getMetric(axios, start, end, 'LOGGED_DAILY_USER'),
        queryKey: ['logged_daily_user'],
      },
      {
        queryFn: () => getMetric(axios, start, end, 'DAILY_USER'),
        queryKey: ['daily_user'],
      },
    ],
  });

  if (loggedDailyUser.isLoading || dailyUser.isLoading) {
    return <LoadingSpinner className={chart} />;
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

  const data = [];
  for (let i = 0; i < fixedDaily.length; i++) {
    data.push({
      time: fixedDaily[i].time,
      loggedUser: fixedLoggedDaily[i].value,
      user: fixedDaily[i].value,
    });
  }

  return (
    <div className={chart}>
      <ResponsiveContainer
        className="text-background dark:text-foreground"
        width="99%"
        height="99%"
      >
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
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            name="Logged user"
            type="monotone"
            dataKey="loggedUser"
            stroke="#8884d8"
            strokeWidth={2}
            fill="currentColor"
            activeDot={{ r: 4 }}
          />
          <Line
            name="User"
            type="monotone"
            dataKey="user"
            stroke="#82ca9d"
            strokeWidth={2}
            fill="currentColor"
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
