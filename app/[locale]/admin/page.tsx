import React from 'react';

import ClientChart from '@/components/metric/client-chart';
import LikeChart from '@/components/metric/like-chart';
import LoginChart from '@/components/metric/login-chart';
import LoginHistory from '@/components/metric/login-history';
import LoginLog from '@/components/metric/login-log';
import WebsiteVisitRate from '@/components/metric/website-visist-rate';
import getServerAPI from '@/query/config/get-server-api';
import getLogs from '@/query/log/get-logs';
import getLoginHistories from '@/query/login-history/get-login-histories';
import getMetric from '@/query/metric/get-metric';

const NUMBER_OF_DAY = 15;

export default async function Page() {
  const axios = await getServerAPI();

  const start = new Date();
  const end = new Date();

  start.setDate(new Date().getDate() - NUMBER_OF_DAY);

  const [
    like,
    authLogin,
    login,
    modClient,
    webClient,
    visit,
    loginLog,
    loginHistory,
  ] = await Promise.all([
    getMetric(axios, start, end, 'DAILY_LIKE'),
    getMetric(axios, start, end, 'LOGGED_DAILY_USER'),
    getMetric(axios, start, end, 'DAILY_USER'),
    getMetric(axios, start, end, 'DAILY_MOD_USER'),
    getMetric(axios, start, end, 'DAILY_WEB_USER'),
    getMetric(axios, start, end, 'DAILY_USER'),
    getLogs(axios, { page: 0, collection: 'USER_LOGIN' }),
    getLoginHistories(axios, { page: 0, size: 20 }),
  ]);

  //TODO: Rework
  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-y-auto overflow-x-hidden bg-background p-4">
      <div className="grid grid-cols-1 items-start gap-2 md:grid-cols-2 lg:grid-cols-3gv">
        {/* <LikeChart axios={axios} start={start} end={end} />
        <LoginChart axios={axios} start={start} end={end} />
        <ClientChart axios={axios} start={start} end={end} />
        <WebsiteVisitRate axios={axios} start={start} end={end} />
        <LoginLog axios={axios} />
        <LoginHistory axios={axios} /> */}
      </div>
    </div>
  );
}
