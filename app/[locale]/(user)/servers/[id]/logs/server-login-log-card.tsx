import { RelativeTime } from '@/components/common/relative-time';

import ServerLoginLog from '@/types/response/ServerLoginLog';

type ServerLoginLogCardProps = {
  data: ServerLoginLog;
};

export default function ServerLoginLogCard({ data: { name, uuid, ip, createdAt } }: ServerLoginLogCardProps) {
  return (
    <>
      <span>{name}</span>
      <span>{uuid}</span>
      <span>{ip}</span>
      <RelativeTime date={new Date(createdAt)} />
    </>
  );
}
