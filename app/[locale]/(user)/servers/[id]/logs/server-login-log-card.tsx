import ColorText from '@/components/common/color-text';
import { RelativeTime } from '@/components/common/relative-time';

import { cn } from '@/lib/utils';
import ServerLoginLog from '@/types/response/ServerLoginLog';

type ServerLoginLogCardProps = {
  data: ServerLoginLog;
  index: number;
};

export default function ServerLoginLogCard({ data: { name, uuid, ip, createdAt }, index }: ServerLoginLogCardProps) {
  return (
    <div className={cn('p-4 grid-cols-1 grid md:grid-cols-4', index % 2 === 0 ? 'bg-card/50' : 'bg-card')}>
      <ColorText text={name} />
      <span>{uuid}</span>
      <span>{ip}</span>
      <RelativeTime date={new Date(createdAt)} />
    </div>
  );
}
