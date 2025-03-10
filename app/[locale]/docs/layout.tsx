import Link from 'next/link';
import { ReactNode } from 'react';

import DocSearchBar from '@/app/[locale]/docs/doc-search-bar';

import { MindustryToolIcon } from '@/components/common/icons';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full relative w-full grid grid-rows-[auto_1fr] overflow-hidden">
      <div className="flex border-b p-4 justify-between items-center overflow-hidden h-16">
        <div className="w-full flex items-center">
          <Link className="flex gap-2 items-center text-xl" href="/">
            <MindustryToolIcon /> MindustryTool
          </Link>
        </div>
        <DocSearchBar />
      </div>
      <div className="h-full w-full overflow-hidden">{children}</div>
    </div>
  );
}
