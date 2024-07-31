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
import { useI18n } from '@/locales/client';
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
  data: { web: Metric[]; mod: Metric[] };
  start: Date;
  dates: number;
};

export default function ClientChart({
  start,
  dates,
  data: { web, mod },
}: Props) {
  const t = useI18n();

  const fixedWeb = fillMetric(start, dates, web, 0);
  const fixedMod = fillMetric(start, dates, mod, 0);
  const total = fixedMod.map((m, index) => ({
    ...m,
    value: m.value + fixedWeb[index].value,
  }));

  const chart: ChartData<'line'> = {
    labels: fixedWeb.map(({ createdAt }) => createdAt),
    datasets: [
      {
        label: t('metric.mod-user'),
        data: fixedMod.map(({ value }) => value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
      {
        label: t('metric.web-user'),
        data: fixedWeb.map(({ value }) => value),
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
    <div className="rounded-lg bg-card flex w-full flex-col h-full gap-2 p-2 aspect-[2/1.5]">
      <span className="font-bold">
        <Tran text="client" />
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
          data={chart}
        />
      </div>
    </div>
  );
}
