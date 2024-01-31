'use client';
import LoadingSpinner from '@/components/common/loading-spinner';
import { APIInstance } from '@/hooks/use-client';
import { fillMetric } from '@/lib/utils';
import getMetric from '@/query/metric/get-metric';
import { useQueries } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
} from 'recharts';

const NUMBER_OF_DAY = 15;

const background =
  'rounded-lg bg-card p-2 flex w-full flex-col gap-2 p-2 h-[500px]';

const chart = 'h-[400px]';

type ChartProps = {
  axios: APIInstance;
  start: Date;
  end: Date;
};

export default function LoginChart(props: ChartProps) {
  return (
    <div className={background}>
      <span className="font-bold">User login</span>
      <Loading {...props} />
    </div>
  );
}

function Loading({ axios: { axios, enabled }, start, end }: ChartProps) {
  const [loggedDailyUser, dailyUser] = useQueries({
    queries: [
      {
        queryFn: () => getMetric(axios, start, end, 'LOGGED_DAILY_USER'),
        queryKey: ['logged_daily_user'],
        enabled,
      },
      {
        queryFn: () => getMetric(axios, start, end, 'DAILY_USER'),
        queryKey: ['daily_user'],
        enabled,
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
