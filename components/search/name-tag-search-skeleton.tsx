'use client';

import React from 'react';

import { FilterIcon, SearchIcon } from '@/components/common/icons';

import { useI18n } from '@/i18n/client';

export default function NameTagSearchSkeleton() {
  const { t } = useI18n();

  return (
    <div className="flex justify-center gap-2">
      <div className="h-10 flex w-full items-center justify-center gap-2 rounded-sm border px-2 shadow-md">
        <SearchIcon className="size-5 shrink-0" />
        <input placeholder={t('search-by-name')} className="h-full w-full bg-transparent hover:outline-none focus:outline-none" />
      </div>
      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-70 text-nowrap border-border bg-transparent hover:bg-accent hover:text-accent-foreground px-4 py-2 h-10 border shadow-md">
        <FilterIcon className="size-5" />
      </button>
    </div>
  );
}
