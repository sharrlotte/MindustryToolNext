'use client';

import React, { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts';

type Props = {
  ramUsage: number;
  totalRam: number;
};

export default function RamUsageChart({ ramUsage, totalRam }: Props) {
  const [selected, setSelected] = useState(0);

  const data = [
    { name: 'Used', value: ramUsage, color: 'green' },
    { name: 'Free', value: totalRam - ramUsage, color: 'cyan' },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          activeIndex={selected}
          activeShape={(props: any) => (
            <TotalRam totalRam={totalRam} ramUsage={ramUsage} {...props} />
          )}
          innerRadius={90}
          outerRadius={150}
          dataKey="value"
          onMouseEnter={(_, index) => setSelected(index)}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={data[index % data.length].color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

type TotalRamProps = {
  totalRam: number;
  ramUsage: number;
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  value: number;
  percent: number;
};

function TotalRam({ ramUsage, totalRam, ...props }: TotalRamProps) {
  if (!props) {
    return undefined;
  }

  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    value,
    percent,
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={4} textAnchor="middle" fill={fill}>
        {value} / {totalRam} | {Math.floor(percent * 10000) / 100}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
}
