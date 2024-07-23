'use client';

import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  ramUsage: number;
  totalRam: number;
};

export default function RamUsageChart({ ramUsage, totalRam }: Props) {
  ramUsage = isNaN(ramUsage) ? 0 : ramUsage;
  totalRam = isNaN(totalRam) ? 0 : totalRam;

  let percentUsage = Math.round((ramUsage / totalRam) * 10000) / 100;

  percentUsage = isNaN(percentUsage) ? 0 : percentUsage;

  let percentFree = Math.round((100 - percentUsage) * 100) / 100;

  let ramLeft = ramUsage === 0 && totalRam === 0 ? 100 : totalRam - ramUsage;

  const data: ChartData<'doughnut'> = {
    labels: [`Used: ${percentUsage}%`, `Free: ${percentFree}%`],
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
    <div className="rounded-lg bg-card p-2 flex w-full flex-col gap-2">
      <span className="font-bold">Ram usage</span>
      <Doughnut className="max-h-[200px] max-w-[200px]" data={data} />
    </div>
  );
}
