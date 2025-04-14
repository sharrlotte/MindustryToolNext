import React from 'react';

import ErrorScreen from '@/components/common/error-screen';
import LikeChartClient from '@/components/metric/like-chart.client';

import { serverApi } from '@/action/common';
import { isError } from '@/lib/error';
import { fillMetric } from '@/lib/utils';
import { getMetric } from '@/query/metric';

type Props = {
	start: Date;
	end: Date;
	dates: number;
};

export default async function LikeChart({ start, dates, end }: Props) {
	const data = await serverApi((axios) => getMetric(axios, start, end, 'DAILY_LIKE'));

	if (isError(data)) {
		return <ErrorScreen error={data} />;
	}

	const filledData = fillMetric(start, dates, data, 0);

	return <LikeChartClient data={filledData} />;
}
