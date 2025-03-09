import Link from 'next/link';
import { ReactNode } from 'react';

import { MindustryToolIcon } from '@/components/common/icons';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full grid grid-rows-[auto_1fr] overflow-hidden">
      <div className="w-full border-b flex items-center p-4">
        <Link className="flex gap-2 items-center text-xl" href="/">
          <MindustryToolIcon /> MindustryTool
        </Link>
      </div>
      <div className="h-full w-full overflow-hidden">{children}</div>
    </div>
  );
}
