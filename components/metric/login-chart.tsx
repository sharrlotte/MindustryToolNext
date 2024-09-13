'use client';

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
import { Line } from 'react-chartjs-2';

import Tran from '@/components/common/tran';
import { fillMetric } from '@/lib/utils';
import { useI18n } from '@/i18n/client';
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
  data: { daily: Metric[]; logged: Metric[] };
  start: Date;
  dates: number;
};

export default function LoginChart({
  start,
  dates,
  data: { logged, daily },
}: Props) {
  const t = useI18n();

  const fixedLoggedDaily = fillMetric(start, dates, logged, 0);
  const fixedDaily = fillMetric(start, dates, daily, 0);
  const total = fixedLoggedDaily.map((m, index) => ({
    ...m,
    value: m.value + fixedDaily[index].value,
  }));

  const data = {
    labels: fixedLoggedDaily.map(({ createdAt }) => createdAt),
    datasets: [
      {
        label: t('metric.daily-user'),
        data: fixedDaily.map(({ value }) => value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
      {
        label: t('metric.logged-user'),
        data: fixedLoggedDaily.map(({ value }) => value),
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
      <div className="flex  h-full w-full flex-col gap-2 bg-card p-2">
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
