'use client';

import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

import Tran from '@/components/common/tran';
import { fillMetric } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { Metric } from '@/types/response/Metric';
import MetricWrapper from '@/components/metric/metric-wrapper';

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
  data: Metric[];
  start: Date;
  dates: number;
};

export default function WebsiteVisitRate({ start, dates, data }: Props) {
  const t = useI18n();
  const filledData = fillMetric(start, dates, data, 0);

  const chart: ChartData<'line'> = {
    labels: filledData.map(({ createdAt }) => createdAt),
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
      <div className="flex aspect-[2/1.5] h-full w-full flex-col justify-between gap-2 bg-card p-2">
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
