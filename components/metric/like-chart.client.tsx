'use client';

import { BarElement, CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

import Tran from '@/components/common/tran';
import MetricWrapper from '@/components/metric/metric-wrapper';

import { useI18n } from '@/i18n/client';
import { ChartData } from '@/types/response/Metric';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

type Props = {
  data: ChartData[];
};

export default function LikeChartClient({ data }: Props) {
  const { t } = useI18n();

  const chart = {
    labels: data.map(({ createdAt }) => createdAt.toLocaleDateString()),
    datasets: [
      {
        label: t('metric.like'),
        data: data.map(({ value }) => value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
    ],
  };

  return (
    <MetricWrapper>
      <div className="flex  h-full w-full flex-col justify-between gap-2 bg-card p-2">
        <span className="font-bold">
          <Tran text="metric.user-interaction" />
        </span>
        <Bar
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
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
