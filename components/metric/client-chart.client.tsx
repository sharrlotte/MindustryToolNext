'use client';

import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

import Tran from '@/components/common/tran';
import MetricWrapper from '@/components/metric/metric-wrapper';

import { useI18n } from '@/i18n/client';
import { ChartData } from '@/types/response/Metric';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = {
  mod: ChartData[];
  web: ChartData[];
  server: ChartData[];
  total: ChartData[];
};

export default function ClientChartClient({ web, mod, server, total }: Props) {
  const { t } = useI18n();

  const chart = {
    labels: web.map(({ createdAt }) => createdAt.toLocaleDateString()),
    datasets: [
      {
        label: t('metric.mod-user'),
        data: mod.map(({ value }) => value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
      {
        label: t('metric.web-user'),
        data: web.map(({ value }) => value),
        borderColor: 'rgb(99, 255, 132)',
        backgroundColor: 'rgba(99, 255, 132)',
        tension: 0.3,
      },
      {
        label: t('metric.server-user'),
        data: server.map(({ value }) => value),
        borderColor: 'rgb(255, 255, 132)',
        backgroundColor: 'rgba(255, 255, 132)',
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
    <MetricWrapper className="col-span-full">
      <div className="flex h-full w-full flex-col gap-2 bg-card p-2">
        <span className="font-bold">
          <Tran text="client" />
        </span>
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
          data={chart}
        />
      </div>
    </MetricWrapper>
  );
}
