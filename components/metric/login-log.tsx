'use client';

import { AxiosInstance } from 'axios';
import moment from 'moment';

import LoadingSpinner from '@/components/common/loading-spinner';
import { useI18n } from '@/locales/client';
import getLogs from '@/query/log/get-logs';

import { useQuery } from '@tanstack/react-query';

const background =
  'rounded-lg bg-card p-2 flex w-full flex-col gap-2 p-2 h-[500px]';

const chart = 'h-[400px]';

type LoginLogProps = {
  axios: AxiosInstance;
};

export default function LoginLog({ axios }: LoginLogProps) {
  const {
    data: logs,
    error,
    isLoading,
  } = useQuery({
    queryFn: () => getLogs(axios, { page: 0, collection: 'USER_LOGIN' }),
    queryKey: ['user_login'],
  });

  const t = useI18n();

  if (isLoading) {
    return (
      <div className={background}>
        <span className="font-bold">{t('metric.user-login-history')}</span>
        <LoadingSpinner className={chart} />
      </div>
    );
  }

  if (error) return <span>{error?.message}</span>;

  return (
    <div className={background}>
      <span className="font-bold">{t('metric.user-login-history')}</span>
      <div className={chart}>
        <section className="no-scrollbar grid h-[450px] gap-2 overflow-y-auto">
          {logs?.map((log) => (
            <span
              className="flex justify-between gap-8 rounded-sm bg-background p-4"
              key={log.id}
            >
              <span>{`${log.content} ${moment(
                new Date(log.createdAt).toISOString(),
              ).fromNow()}`}</span>
              <span>{log.ip}</span>
            </span>
          ))}
        </section>
      </div>
    </div>
  );
}
