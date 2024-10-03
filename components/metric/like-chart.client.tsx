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
  data: ChartData[];
};

export default function LikeChartClient({ data }: Props) {
  const t = useI18n();

  const chart = {
    labels: data.map(({ createdAt }) => createdAt),
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
        <div className="h-full bg-card">
          <Line
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
      </div>
    </MetricWrapper>
  );
}
