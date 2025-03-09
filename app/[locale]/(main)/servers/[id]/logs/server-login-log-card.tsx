'use client';

import { useState } from 'react';

import ColorText from '@/components/common/color-text';
import { EyeIcon, EyeOffIcon } from '@/components/common/icons';
import { RelativeTime } from '@/components/common/relative-time';

import { cn } from '@/lib/utils';
import ServerLoginLog from '@/types/response/ServerLoginLog';

type ServerLoginLogCardProps = {
  data: ServerLoginLog;
  index: number;
};

export default function ServerLoginLogCard({ data: { name, uuid, ip, createdAt }, index }: ServerLoginLogCardProps) {
  const [showUuid, setShowUuid] = useState(false);
  const [showIp, setShowIp] = useState(false);

  return (
    <div className={cn('p-4 grid-cols-1 grid md:grid-cols-4 gap-2', index % 2 === 0 ? 'bg-card/50' : 'bg-card')}>
      <ColorText text={name} />
      <div className="flex items-center gap-2 group">
        {showUuid ? uuid : '*'.repeat(27)}
        <button className="group-hover:opacity-100 group-focus:opacity-100 opacity-0" onClick={() => setShowUuid((prev) => !prev)}>
          {showUuid ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      <div className="flex items-center gap-2 group">
        {showIp ? ip : ip.replaceAll(/\d/g, '*')}
        <button className="group-hover:opacity-100 group-focus:opacity-100 opacity-0" onClick={() => setShowIp((prev) => !prev)}>
          {showIp ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      <RelativeTime date={new Date(createdAt)} />
    </div>
  );
}
