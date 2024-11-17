'use client';

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

import Tran from '@/components/common/tran';
import { useI18n } from '@/i18n/client';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  ramUsage: number;
  totalRam: number;
};

export default function RamUsageChart({ ramUsage, totalRam }: Props) {
  const t = useI18n();

  ramUsage = isNaN(ramUsage) ? 0 : ramUsage;
  totalRam = isNaN(totalRam) ? 0 : totalRam;

  let percentUsage = Math.round((ramUsage / totalRam) * 10000) / 100;

  percentUsage = isNaN(percentUsage) ? 0 : percentUsage;

  const percentFree = Math.round((100 - percentUsage) * 100) / 100;

  const ramLeft = ramUsage === 0 && totalRam === 0 ? 100 : totalRam - ramUsage;

  const data = {
    labels: [t('metric.ram-used', { percent: percentUsage }), t('metric.ram-free', { percent: percentFree })],
    datasets: [
      {
        data: [ramUsage, ramLeft],
        backgroundColor: [
          percentUsage < 50
            ? 'green' //
            : percentUsage < 70
              ? 'gold'
              : 'red',
          'white',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-2 rounded-lg bg-card p-2">
      <span className="font-bold">
        <Tran text="metric.ram-usage" />
      </span>
      <Doughnut className="max-h-[200px] max-w-[200px]" data={data} />
    </div>
  );
}
