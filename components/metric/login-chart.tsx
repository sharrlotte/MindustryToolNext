import ErrorScreen from '@/components/common/error-screen';
import LoginChartClient from '@/components/metric/login-chart.client';



import { serverApi } from '@/action/action';
import { fillMetric } from '@/lib/utils';
import { isError } from '@/lib/utils';
import { getMetric } from '@/query/metric';


type Props = {
  start: Date;
  end: Date;
  dates: number;
};

export default async function LoginChart({ start, dates, end }: Props) {
  const [logged, daily] = await Promise.all([serverApi((axios) => getMetric(axios, start, end, 'LOGGED_DAILY_USER')), serverApi((axios) => getMetric(axios, start, end, 'DAILY_USER'))]);

  if (isError(logged)) {
    return <ErrorScreen error={logged} />;
  }

  if (isError(daily)) {
    return <ErrorScreen error={daily} />;
  }

  const fixedLoggedDaily = fillMetric(start, dates, logged, 0);
  const fixedDaily = fillMetric(start, dates, daily, 0);
  const total = fixedLoggedDaily.map((m, index) => ({
    ...m,
    value: m.value + fixedDaily[index].value,
  }));

  return <LoginChartClient loggedDaily={fixedLoggedDaily} daily={fixedDaily} total={total} />;
}
