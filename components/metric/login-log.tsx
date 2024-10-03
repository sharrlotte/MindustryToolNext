import Tran from '@/components/common/tran';
import { Log } from '@/types/response/Log';
import MetricWrapper from '@/components/metric/metric-wrapper';
import { serverApi } from '@/action/action';
import getLogs from '@/query/log';
import ErrorScreen from '@/components/common/error-screen';

export default async function LoginLog() {
  return (
    <MetricWrapper>
      <LoginTable />
    </MetricWrapper>
  );
}

type LoginLogCardProps = {
  log: Log;
};

async function LoginTable() {
  const data = await serverApi((axios) =>
    getLogs(axios, { page: 0, collection: 'USER_LOGIN' }),
  );

  if ('error' in data) {
    return <ErrorScreen error={data} />;
  }

  return (
    <div className="flex h-[500px] w-full flex-col gap-2 bg-card p-2">
      <span className="font-bold">
        <Tran text="metric.user-login-history" />
      </span>
      <div className="h-[400px]">
        <section className="no-scrollbar grid h-[450px] gap-2 overflow-y-auto">
          {data.map((log) => (
            <LoginLogCard key={log.id} log={log} />
          ))}
        </section>
      </div>
    </div>
  );
}

function LoginLogCard({
  log: { id, content, ip, createdAt },
}: LoginLogCardProps) {
  const from = new Date(createdAt).toLocaleString();

  return (
    <span
      className="flex justify-between gap-8 rounded-sm bg-background p-4"
      key={id}
    >
      <span>{`${content} ${from}`}</span>
      <span>{ip}</span>
    </span>
  );
}
