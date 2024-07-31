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
import { Line } from 'react-chartjs-2';

import Tran from '@/components/common/tran';
import { fillMetric } from '@/lib/utils';
import { Metric } from '@/types/response/Metric';

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
  const fixedLoggedDaily = fillMetric(start, dates, logged, 0);
  const fixedDaily = fillMetric(start, dates, daily, 0);

  const data: ChartData<'line'> = {
    labels: fixedLoggedDaily.map(({ createdAt }) => createdAt),
    datasets: [
      {
        label: 'User',
        data: fixedDaily.map(({ value }) => value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Logged in user',
        data: fixedLoggedDaily.map(({ value }) => value),
        borderColor: 'rgb(99, 255, 132)',
        backgroundColor: 'rgba(99, 255, 132)',
        tension: 0.3,
      },
    ],
  };
  return (
    <div className="rounded-lg bg-card flex w-full flex-col h-full gap-2 p-2 aspect-[2/1.5]">
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
  );
}
