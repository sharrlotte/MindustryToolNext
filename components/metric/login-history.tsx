'use client';

import Tran from '@/components/common/tran';
import { UserLoginHistory } from '@/types/response/UserLoginHistory';

type Props = {
  data: UserLoginHistory[];
};

export default function LoginHistory({ data }: Props) {
  return (
    <div className="rounded-lg bg-card flex w-full flex-col gap-2 p-2 h-[500px]">
      <span className="font-bold">
        <Tran text="metric.user-login-history" />
      </span>
      <div className="h-[400px]">
        <section className="no-scrollbar grid h-[450px] gap-2 overflow-y-auto">
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

function LoginHistoryCard({
  history: { id, counts, ip, userId, client },
}: LoginHistoryCardProps) {
  const username = userId ?? 'Anonymous';
  const clientType = client === 1000 ? 'web' : 'mod';

  return (
    <span
      className="flex justify-between gap-8 rounded-sm bg-background p-4"
      key={id}
    >
      <span>
        User {username} ({ip}) on {clientType}
      </span>
      <span>Times {counts}</span>
    </span>
  );
}
