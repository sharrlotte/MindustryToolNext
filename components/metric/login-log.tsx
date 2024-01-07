'use client';

import LoadingSpinner from '@/components/ui/loading-spinner';
import { APIInstance } from '@/hooks/use-client';
import getLogs from '@/query/log/get-logs';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

const background =
  'rounded-lg bg-zinc-900 p-2 flex w-full flex-col gap-2 p-2 h-[500px]';

const chart = 'h-[400px]';

type LoginLogProps = {
  axios: APIInstance;
};

export default function LoginLog({ axios: { axios, enabled } }: LoginLogProps) {
  const {
    data: logs,
    error,
    isLoading,
  } = useQuery({
    queryFn: () => getLogs(axios, { page: 0, collection: 'USER_LOGIN' }),
    queryKey: ['user_login'],
    enabled,
  });

  if (isLoading) {
    return (
      <div className={background}>
        <span className="font-bold">User login history</span>
        <LoadingSpinner className={chart} />
      </div>
    );
  }

  if (error) return <span>{error?.message}</span>;

  return (
    <div className={background}>
      <span className="font-bold">User login history</span>
      <div className={chart}>
        <section className="no-scrollbar grid h-[450px] gap-2 overflow-y-auto">
          {logs?.map((log) => (
            <span
              className="flex justify-between gap-8 rounded-sm bg-zinc-700 p-4"
              key={log.id}
            >
              <span>{`${log.content} ${moment(
                new Date(log.time).toISOString(),
              ).fromNow()}`}</span>
              <span>{log.ip}</span>
            </span>
          ))}
        </section>
      </div>
    </div>
  );
}
