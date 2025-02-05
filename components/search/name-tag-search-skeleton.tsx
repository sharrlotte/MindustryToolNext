'use client';

import React from 'react';

import { FilterIcon, SearchIcon } from '@/components/common/icons';

import { useI18n } from '@/i18n/client';

export default function NameTagSearchSkeleton() {
  const { t } = useI18n();

  return (
    <div className="flex h-11 justify-center gap-1.5 rounded-md">
      <div className="flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-card px-3 shadow-md">
        <SearchIcon className="size-5 shrink-0" />
        <input placeholder={t('search-by-name')} className="h-full w-full bg-card hover:outline-none focus:outline-none" />
      </div>
      <button className="inline-flex h-11 items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none border-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-70 text-nowrap hover:bg-accent hover:text-accent-foreground px-4 py-2 bg-card rounded-sm border shadow-md">
        <FilterIcon className="size-5" />
      </button>
    </div>
  );
}
