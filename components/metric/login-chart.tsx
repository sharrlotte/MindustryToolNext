import { fillMetric } from '@/lib/utils';
import LoginChartClient from '@/components/metric/login-chart.client';
import { getMetric } from '@/query/metric';
import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';

type Props = {
  start: Date;
  end: Date;
  dates: number;
};

export default async function LoginChart({ start, dates, end }: Props) {
  const [logged, daily] = await Promise.all([
    serverApi((axios) => getMetric(axios, start, end, 'DAILY_LIKE')),
    serverApi((axios) => getMetric(axios, start, end, 'LOGGED_DAILY_USER')),
  ]);

  if ('error' in logged) {
    return <ErrorScreen error={logged} />;
  }

  if ('error' in daily) {
    return <ErrorScreen error={daily} />;
  }

  const fixedLoggedDaily = fillMetric(start, dates, logged, 0);
  const fixedDaily = fillMetric(start, dates, daily, 0);
  const total = fixedLoggedDaily.map((m, index) => ({
    ...m,
    value: m.value + fixedDaily[index].value,
  }));

  return (
    <LoginChartClient
      loggedDaily={fixedLoggedDaily}
      daily={fixedDaily}
      total={total}
    />
  );
}
