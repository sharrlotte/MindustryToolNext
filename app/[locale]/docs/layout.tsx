import Link from 'next/link';
import { ReactNode } from 'react';

import DocSearchBar from '@/app/[locale]/docs/doc-search-bar';

import { MindustryToolIcon } from '@/components/common/icons';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full relative w-full grid grid-rows-[auto_1fr] overflow-hidden">
      <div className="flex border-b p-4 items-center overflow-hidden h-16 gap-8 bg-card/80">
        <div className="flex items-center gap-2">
          <Link className="flex gap-2 items-center text-xl font-semibold" href="/">
            <MindustryToolIcon /> MindustryTool
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link className="flex gap-2 items-center text-base hover:text-brand" href="/docs/wiki/getting-started">
            Wiki
          </Link>
          <Link className="flex gap-2 items-center text-base hover:text-brand" href="/docs/api/getting-started">
            Api
          </Link>
        </div>
        <DocSearchBar />
      </div>
      <div className="h-full w-full overflow-hidden">{children}</div>
    </div>
  );
}
