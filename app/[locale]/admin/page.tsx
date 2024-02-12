'use client';

import React from 'react';
import LikeChart from '@/components/metric/like-chart';
import LoginChart from '@/components/metric/login-chart';
import LoginLog from '@/components/metric/login-log';
import useClientAPI from '@/hooks/use-client';

const NUMBER_OF_DAY = 15;

export default function Page() {
  const axios = useClientAPI();

  const start = new Date();
  start.setDate(new Date().getDate() + 1);
  const end = new Date();
  start.setDate(new Date().getDate() - NUMBER_OF_DAY);

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-y-auto overflow-x-hidden bg-background pr-2">
      <div className="grid grid-cols-1 items-start gap-2 md:grid-cols-2">
        <LikeChart axios={axios} start={start} end={end} />
        <LoginChart axios={axios} start={start} end={end} />
        <LoginLog axios={axios} />
      </div>
    </div>
  );
}
