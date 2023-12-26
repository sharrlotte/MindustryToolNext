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
import getLogs from '@/query/log/get-logs';
import moment from 'moment';

const NUMBER_OF_DAY = 15;

const background =
  'rounded-lg bg-slate-600 bg-opacity-40 p-2 flex flex-col gap-2 p-2 h-[500px]';

const chart = 'h-[450px]';

export default function Page() {
  const axiosClient = useClient();

  let start = new Date();
  let end = new Date();
  start.setDate(new Date().getDate() - NUMBER_OF_DAY);

  return (
    <main className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4">
      <span className="text-xl font-bold">Dashboard</span>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <LikeChart axiosClient={axiosClient} start={start} end={end} />
        <LoginChart axiosClient={axiosClient} start={start} end={end} />
        <LoginLog axiosClient={axiosClient} />
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

  for (let i = numberOfDay; i > 0; i--) {
    let targetDay = new Date(start);
    targetDay.setDate(targetDay.getDate() + numberOfDay - i + 1);
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

function LikeChart({
  axiosClient: { axiosClient, enabled },
  start,
  end,
}: ChartProps) {
  const {
    data: metric,
    error,
    isLoading,
  } = useQuery({
    queryFn: () => getMetric(axiosClient, start, end, 'daily_like'),
    queryKey: ['daily_like'],
    enabled,
  });

  if (isLoading) {
    return <LoadingSpinner className={background} />;
  }

  if (error || !metric) return <span>{error?.message}</span>;

  const data = fill(start, NUMBER_OF_DAY, metric, 0);

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
              stroke="#8884d8"
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LoginChart({
  axiosClient: { axiosClient, enabled },
  start,
  end,
}: ChartProps) {
  const [loggedDailyUser, dailyUser] = useQueries({
    queries: [
      {
        queryFn: () => getMetric(axiosClient, start, end, 'logged_daily_user'),
        queryKey: ['logged_daily_user'],
        enabled,
      },
      {
        queryFn: () => getMetric(axiosClient, start, end, 'daily_user'),
        queryKey: ['daily_user'],
        enabled,
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
      <span className="font-bold">User login</span>
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
              fill="currentColor"
              activeDot={{ r: 4 }}
            />
            <Line
              name="User"
              type="monotone"
              dataKey="user"
              stroke="#82ca9d"
              fill="currentColor"
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

type LoginLogProps = {
  axiosClient: UseClient;
};

function LoginLog({ axiosClient: { axiosClient, enabled } }: LoginLogProps) {
  const {
    data: logs,
    error,
    isLoading,
  } = useQuery({
    queryFn: () => getLogs(axiosClient, { page: 0, collection: 'user_login' }),
    queryKey: ['user_login'],
    enabled,
  });

  if (isLoading) {
    return <LoadingSpinner className={background} />;
  }

  if (error || !logs) return <span>{error?.message}</span>;

  return (
    <div className={background}>
      <span className="font-bold">User login logs</span>
      <div className={chart}>
        <section className="no-scrollbar grid h-[450px] gap-2 overflow-y-auto">
          {logs.map((log) => (
            <span className="flex justify-between" key={log.id}>
              <div>
                <span>{`${log.content} ${moment(
                  new Date(log.time).toISOString(),
                ).fromNow()}`}</span>
              </div>
              <span>{log.ip}</span>
            </span>
          ))}
        </section>
      </div>
    </div>
  );
}
