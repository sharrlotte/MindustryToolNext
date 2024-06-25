import moment from 'moment';

import ColorText from '@/components/common/color-text';
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
  const axios = useClientAPI();
  const { userId, content, createdAt } = message;
  const { data } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUser(axios, { id: userId }),
  });

  if (!data) {
    return <></>;
  }

  const { name, roles } = data;

  return (
    <div
      className={cn('w-full text-wrap rounded-lg flex p-2 gap-2', className)}
    >
      <UserAvatar user={data} />
      <div>
        <div className="space-x-2">
          <ColorAsRole className="font-semibold capitalize" roles={roles}>
            {name}
          </ColorAsRole>
          <span>{moment(createdAt).fromNow()}</span>
        </div>
        <div className="grid gap-1">
          {content.map((c, index) => (
            <ColorText key={index} text={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
