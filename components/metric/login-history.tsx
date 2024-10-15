import { serverApi } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';
import Tran from '@/components/common/tran';
import MetricWrapper from '@/components/metric/metric-wrapper';
import { getLoginHistories } from '@/query/login-history';
import { UserLoginHistory } from '@/types/response/UserLoginHistory';

export default function LoginHistory() {
  return (
    <MetricWrapper>
      <LoginTable />
    </MetricWrapper>
  );
}

async function LoginTable() {
  const data = await serverApi((axios) => getLoginHistories(axios, { page: 0, size: 20 }));

  if ('error' in data) {
    return <ErrorScreen error={data} />;
  }

  return (
    <div className="flex min-h-[500px] w-full flex-col gap-2 bg-card p-2">
      <span className="font-bold">
        <Tran text="metric.user-login-history" />
      </span>
      <div>
        <section className="grid h-[450px] gap-2 overflow-y-auto">
          {data.map((history) => (
            <LoginHistoryCard key={history.id} history={history} />
          ))}
        </section>
      </div>
    </div>
  );
}

type LoginHistoryCardProps = {
  history: UserLoginHistory;
};

function LoginHistoryCard({ history: { id, counts, ip, userId, client } }: LoginHistoryCardProps) {
  const username = userId ?? 'Anonymous';
  const clientType = client === 1000 ? 'web' : 'mod';

  return (
    <span className="flex justify-between gap-8 rounded-sm bg-background p-4" key={id}>
      <span>
        User {username} ({ip}) on {clientType}
      </span>
      <span>Times {counts}</span>
    </span>
  );
}
