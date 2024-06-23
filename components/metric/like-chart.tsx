'use client';

import { AxiosInstance } from 'axios';
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

import LoadingSpinner from '@/components/common/loading-spinner';
import { fillMetric } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import getMetric from '@/query/metric/get-metric';

import { useQuery } from '@tanstack/react-query';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

const NUMBER_OF_DAY = 15;
const background =
  'rounded-lg bg-card flex w-full flex-col gap-2 p-2 h-[500px]';

const chart = 'h-[400px]';

type ChartProps = {
  axios: AxiosInstance;
  start: Date;
  end: Date;
};

export default function LikeChart(props: ChartProps) {
  const t = useI18n();

  return (
    <div className={background}>
      <span className="font-bold">{t('metric.user-interaction')}</span>
      <Loading {...props} />
    </div>
  );
}

function Loading({ axios, start, end }: ChartProps) {
  const {
    data: metric,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => getMetric(axios, start, end, 'DAILY_LIKE'),
    queryKey: ['daily_like'],
  });

  if (isLoading) {
    return <LoadingSpinner className={chart} />;
  }

  if (isError || error) return <span>{error?.message}</span>;

  const fixedData = fillMetric(start, NUMBER_OF_DAY, metric, 0);

  const data: ChartData<'line'> = {
    labels: fixedData.map(({ time }) => time),
    datasets: [
      {
        label: 'Interaction',
        data: fixedData.map(({ value }) => value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className={chart}>
      <Line options={options} data={data} />
    </div>
  );
}
