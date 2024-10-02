import React from 'react';

import ClientChart from '@/components/metric/client-chart';
import LikeChart from '@/components/metric/like-chart';
import LoginChart from '@/components/metric/login-chart';
import LoginHistory from '@/components/metric/login-history';
import LoginLog from '@/components/metric/login-log';
import WebsiteVisitRate from '@/components/metric/website-visist-rate';
import getLogs from '@/query/log';
import { getLoginHistories } from '@/query/login-history';
import { getMetric } from '@/query/metric';
import { getServerApi } from '@/action/action';

const NUMBER_OF_DAY = 15;

export default async function Page() {
  const axios = await getServerApi();

  const start = new Date();
  const end = new Date();
  end.setUTCHours(23, 59, 59, 999);

  start.setDate(new Date().getDate() - NUMBER_OF_DAY);

  const [like, logged, daily, mod, web, server, visit, loginLog, loginHistory] =
    await Promise.all([
      getMetric(axios, start, end, 'DAILY_LIKE'),
      getMetric(axios, start, end, 'LOGGED_DAILY_USER'),
      getMetric(axios, start, end, 'DAILY_USER'),
      getMetric(axios, start, end, 'DAILY_MOD_USER'),
      getMetric(axios, start, end, 'DAILY_WEB_USER'),
      getMetric(axios, start, end, 'DAILY_SERVER_USER'),
      getMetric(axios, start, end, 'DAILY_USER'),
      getLogs(axios, { page: 0, collection: 'USER_LOGIN' }),
      getLoginHistories(axios, { page: 0, size: 20 }),
    ]);

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-y-auto overflow-x-hidden bg-background p-4">
      <div className="lg:grid-cols-3gv grid grid-cols-1 items-start gap-2 md:grid-cols-2">
        <LikeChart start={start} dates={NUMBER_OF_DAY} data={like} />
        <LoginChart
          start={start}
          dates={NUMBER_OF_DAY}
          data={{ logged, daily }}
        />
        <ClientChart
          start={start}
          dates={NUMBER_OF_DAY}
          data={{ mod, web, server }}
        />
        <WebsiteVisitRate start={start} dates={NUMBER_OF_DAY} data={visit} />
        <LoginLog data={loginLog} />
        <LoginHistory data={loginHistory} />
      </div>
    </div>
  );
}
