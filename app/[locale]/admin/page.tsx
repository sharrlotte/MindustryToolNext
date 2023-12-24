'use client';
import LoadingSpinner from '@/components/ui/loading-spinner';
import useClient, { UseClient } from '@/hooks/use-client';
import getMetric from '@/query/metric/get-metric';
import { Metric } from '@/types/response/Metric';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import React from 'react';

const NUMBER_OF_DAY = 15;

const background =
  'rounded-lg bg-slate-600 bg-opacity-40 p-2 w-[clamp(100px,100%,400px)] aspect-square';

export default function Page() {
  const axiosClient = useClient();

  let start = new Date();
  let end = new Date();
  start.setDate(new Date().getDate() - NUMBER_OF_DAY);

  return (
    <main className="grid h-full w-full">
      <div className="flex items-start justify-start gap-4">
        <LikeChart axiosClient={axiosClient} start={start} end={end} />
        <LoginChart axiosClient={axiosClient} start={start} end={end} />
      </div>
    </main>
  );
}

function fill(
  start: Date,
  numberOfDay: number,
  array: Metric[],
  defaultValue: number,
) {
  let result: Metric[] = [];

  for (let i = 0; i < numberOfDay + 1; i++) {
    let targetDay = new Date(start);
    targetDay.setDate(numberOfDay + i);
    let value = array.find(
      (v) =>
        v.time.getFullYear() === targetDay.getFullYear() &&
        v.time.getMonth() === targetDay.getMonth() &&
        v.time.getDate() === targetDay.getDate(),
    );
    if (value === undefined)
      result.push({ value: defaultValue, time: targetDay });
    else result.push(value);
  }
  return result.map(({ value, time }) => {
    return {
      value: value,
      time: `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}`,
    };
  });
}

type ChartProps = {
  axiosClient: UseClient;
  start: Date;
  end: Date;
};

function LikeChart({ axiosClient, start, end }: ChartProps) {
  const {
    data: metric,
    error,
    isLoading,
  } = useQuery({
    queryFn: () => getMetric(axiosClient.axiosClient, start, end, 'daily_like'),
    queryKey: ['daily_like'],
    enabled: axiosClient.enabled,
  });

  if (isLoading) {
    return <LoadingSpinner className={background} />;
  }

  if (error || !metric) return <span>{error?.message}</span>;

  const data = fill(start, NUMBER_OF_DAY, metric, 0);

  return (
    <div className={background}>
      <ResponsiveContainer width="99%" height="99%" aspect={1}>
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
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function LoginChart({ axiosClient, start, end }: ChartProps) {
  const [loggedDailyUser, dailyUser] = useQueries({
    queries: [
      {
        queryFn: () =>
          getMetric(axiosClient.axiosClient, start, end, 'logged_daily_user'),
        queryKey: ['logged_daily_user'],
        enabled: axiosClient.enabled,
      },
      {
        queryFn: () =>
          getMetric(axiosClient.axiosClient, start, end, 'daily_user'),
        queryKey: ['daily_user'],
        enabled: axiosClient.enabled,
      },
    ],
  });

  if (loggedDailyUser.isLoading || dailyUser.isLoading) {
    return <LoadingSpinner className={background} />;
  }

  if (
    loggedDailyUser.error ||
    dailyUser.error ||
    !loggedDailyUser.data ||
    !dailyUser.data
  )
    return (
      <span>{loggedDailyUser.error?.message || dailyUser.error?.message}</span>
    );

  let fixedLoggedDaily = fill(start, NUMBER_OF_DAY, loggedDailyUser.data, 0);

  let fixedDaily = fill(start, NUMBER_OF_DAY, dailyUser.data, 0);

  const data = [];
  for (let i = 0; i < fixedDaily.length; i++) {
    data.push({
      time: fixedDaily[i].time,
      loggedUser: fixedLoggedDaily[i].value,
      user: fixedDaily[i].value,
    });
  }

  return (
    <div className={background}>
      <ResponsiveContainer width="99%" height="99%" aspect={1}>
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
            fill="currentColor"
            activeDot={{ r: 8 }}
          />
          <Line
            name="User"
            type="monotone"
            dataKey="user"
            stroke="#82ca9d"
            fill="currentColor"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
