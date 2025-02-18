import { RelativeTime } from '@/components/common/relative-time';

import { cn } from '@/lib/utils';
import ServerLoginLog from '@/types/response/ServerLoginLog';

type ServerLoginLogCardProps = {
  data: ServerLoginLog;
  index: number;
};

export default function ServerLoginLogCard({ data: { name, uuid, ip, createdAt }, index }: ServerLoginLogCardProps) {
  return (
  <div className={cn('p-1', index % 2 === 0 ? 'bg-card/80' : 'bg-card')}>
      <span>{name}</span>
      <span>{uuid}</span>
      <span>{ip}</span>
      <RelativeTime date={new Date(createdAt)} />
    </div>
  );
}
