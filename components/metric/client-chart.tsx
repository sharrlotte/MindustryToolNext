import { fillMetric } from '@/lib/utils';
import { serverApi } from '@/action/action';
import { getMetric } from '@/query/metric';
import ErrorScreen from '@/components/common/error-screen';
import ClientChartClient from '@/components/metric/client-chart.client';

type Props = {
  start: Date;
  end: Date;
  dates: number;
};

export default async function ClientChart({ start, end, dates }: Props) {
  const [mod, web, server] = await Promise.all([
    serverApi((axios) => getMetric(axios, start, end, 'DAILY_MOD_USER')),
    serverApi((axios) => getMetric(axios, start, end, 'DAILY_WEB_USER')),
    serverApi((axios) => getMetric(axios, start, end, 'DAILY_SERVER_USER')),
  ]);

  if ('error' in mod) {
    return <ErrorScreen error={mod} />;
  }

  if ('error' in web) {
    return <ErrorScreen error={web} />;
  }

  if ('error' in server) {
    return <ErrorScreen error={server} />;
  }

  const fixedWeb = fillMetric(start, dates, web, 0);
  const fixedMod = fillMetric(start, dates, mod, 0);
  const fixedServer = fillMetric(start, dates, server, 0);
  const total = fixedMod.map((m, index) => ({
    ...m,
    value: m.value + fixedWeb[index].value + fixedServer[index].value,
  }));

  return (
    <ClientChartClient
      mod={fixedMod}
      web={fixedWeb}
      server={fixedServer}
      total={total}
    />
  );
}
