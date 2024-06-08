'use client';

import LoadingSpinner from '@/components/common/loading-spinner';
import { APIInstance } from '@/hooks/use-client';
import { useI18n } from '@/locales/client';
import getLoginHistories from '@/query/login-history/get-login-histories';

import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

const background =
  'rounded-lg bg-card p-2 flex w-full flex-col gap-2 p-2 h-[500px]';

const chart = 'h-[400px]';

type LoginLogProps = {
  axios: APIInstance;
};

export default function LoginHistory({
  axios: { axios, enabled },
}: LoginLogProps) {
  const { data, error, isLoading } = useQuery({
    queryFn: () => getLoginHistories(axios, { page: 0, items: 20 }),
    queryKey: ['login-histories'],
    enabled,
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
          {data?.map(({ id, times, ip, userId, client }) => (
            <span
              className="flex justify-between gap-8 rounded-sm bg-background p-4"
              key={id}
            >
              <span>
                User: {userId ?? 'Anonymous'} ({ip}) on {client}
              </span>
              <span>Times {times}</span>
            </span>
          ))}
        </section>
      </div>
    </div>
  );
}
