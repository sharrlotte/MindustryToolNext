import moment from 'moment';

import ColorText from '@/components/common/color-text';
import { Skeleton } from '@/components/ui/skeleton';
import ColorAsRole from '@/components/user/color-as-role';
import UserAvatar from '@/components/user/user-avatar';
import useClientAPI from '@/hooks/use-client';
import { cn } from '@/lib/utils';
import getUser from '@/query/user/get-user';
import { Message } from '@/types/response/Message';

import { useQuery } from '@tanstack/react-query';

type Props = {
  className?: string;
  message: Message;
};

export function MessageCard({ className, message }: Props) {
  const { id, userId, content, createdAt } = message;
  const axios = useClientAPI();

  const { data } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUser(axios, { id: userId }),
  });

  return (
    <div
      className={cn('w-full text-wrap rounded-lg flex p-2 gap-2', className)}
    >
      {data ? (
        <UserAvatar user={data} />
      ) : (
        <Skeleton className="rounded-full border border-border w-8 h-8" />
      )}
      <div className="overflow-hidden">
        <div className="space-x-2">
          {data ? (
            <ColorAsRole
              className="font-semibold capitalize"
              roles={data.roles}
            >
              {data.name}
            </ColorAsRole>
          ) : (
            <Skeleton className="w-24 h-6" />
          )}
          <span>{moment(createdAt).fromNow()}</span>
        </div>
        <div className="grid gap-1 overflow-x-auto w-full no-scrollbar">
          {content.map((c, index) => (
            <ColorText key={index} text={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
