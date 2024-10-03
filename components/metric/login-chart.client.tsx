'use client';

import Tran from '@/components/common/tran';
import MetricWrapper from '@/components/metric/metric-wrapper';
import { useI18n } from '@/i18n/client';
import { ChartData } from '@/types/response/Metric';
import React from 'react';
import { Line } from 'react-chartjs-2';

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

type Props = {
  loggedDaily: ChartData[];
  daily: ChartData[];
  total: ChartData[];
};

export default function LoginChartClient({ loggedDaily, daily, total }: Props) {
  const t = useI18n();

  const data = {
    labels: loggedDaily.map(({ createdAt }) => createdAt),
    datasets: [
      {
        label: t('metric.daily-user'),
        data: daily.map(({ value }) => value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
      {
        label: t('metric.logged-user'),
        data: loggedDaily.map(({ value }) => value),
        borderColor: 'rgb(99, 255, 132)',
        backgroundColor: 'rgba(99, 255, 132)',
        tension: 0.3,
      },
      {
        label: t('metric.total-user'),
        data: total.map(({ value }) => value),
        borderColor: 'rgb(99, 132, 255)',
        backgroundColor: 'rgb(99, 132, 255)',
        tension: 0.3,
      },
    ],
  };
  return (
    <MetricWrapper>
      <div className="flex h-full w-full flex-col gap-2 bg-card p-2">
        <span className="font-bold">
          <Tran text="metric.user-login" />
        </span>
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
      </div>
    </MetricWrapper>
  );
}
