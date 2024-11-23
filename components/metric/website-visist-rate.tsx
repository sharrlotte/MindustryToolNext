'use client';

import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

import Tran from '@/components/common/tran';
import MetricWrapper from '@/components/metric/metric-wrapper';

import { useI18n } from '@/i18n/client';
import { fillMetric } from '@/lib/utils';
import { Metric } from '@/types/response/Metric';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = {
  data: Metric[];
  start: Date;
  dates: number;
};

export default function WebsiteVisitRate({ start, dates, data }: Props) {
  const t = useI18n();
  const filledData = fillMetric(start, dates, data, 0);

  const chart = {
    labels: filledData.map(({ createdAt }) => createdAt.toLocaleDateString()),
    datasets: [
      {
        label: t('metric.visit-rate'),
        data: filledData.map(({ value }) => value),
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
            suppressHydrationWarning
          />
        </div>
      </div>
    </MetricWrapper>
  );
}
