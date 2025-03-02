import ColorText from '@/components/common/color-text';
import { RelativeTime } from '@/components/common/relative-time';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ColorAsRole from '@/components/user/color-as-role';
import UserAvatar from '@/components/user/user-avatar';

import useClientApi from '@/hooks/use-client';
import { cn } from '@/lib/utils';
import { persister } from '@/query/config/query-config';
import { getUser } from '@/query/user';
import { MessageGroup } from '@/types/response/Message';

import { useQuery } from '@tanstack/react-query';

type Props = {
  className?: string;
  message: MessageGroup;
};

export function MessageCard({ className, message }: Props) {
  const { userId, contents, createdAt } = message;
  const axios = useClientApi();

  const { data } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUser(axios, { id: userId }),
    persister,
  });

  return (
    <div className={cn('flex w-full gap-2 text-wrap rounded-lg p-2 text-base', className)}>
      {data ? <UserAvatar url={`/users/${userId}`} user={data} /> : <Skeleton className="flex size-8 min-h-8 min-w-8 items-center justify-center rounded-full border border-border capitalize" />}
      <div className="overflow-hidden">
        <div className="flex gap-2">
          {data ? (
            <ColorAsRole className="font-semibold capitalize" roles={data.roles}>
              {data.name}
            </ColorAsRole>
          ) : (
            <Skeleton className="h-4 max-h-1 w-24" />
          )}
          <RelativeTime date={new Date(createdAt)} />
        </div>
        <div className="no-scrollbar grid w-full gap-1 overflow-hidden">
          <TooltipProvider>
            {contents.map(({ text, createdAt }, index) => (
              <Tooltip key={index}>
                <TooltipTrigger className="w-fit p-0 items-start justify-start">
                  <ColorText className="overflow-hidden break-words text-base" text={text} />
                </TooltipTrigger>
                <TooltipContent>{new Date(createdAt).toLocaleString()}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

export function MessageCardSkeleton() {
  return (
    <div className="h-16 flex w-full gap-2 text-wrap rounded-lg p-2 text-base">
      <Skeleton className="flex size-8 min-h-8 min-w-8 items-center justify-center rounded-full border border-border capitalize" />
      <div className="overflow-hidden">
        <div className="flex gap-2">
          <Skeleton className="h-4 max-h-1 w-24" />
        </div>
        <div className="no-scrollbar grid w-full gap-1 overflow-hidden">
          <Skeleton className="h-6 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
