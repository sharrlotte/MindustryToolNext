'use client';

import React from 'react';

import { FilterIcon, SearchIcon } from '@/components/common/icons';

import { useI18n } from '@/i18n/client';

export default function NameTagSearchSkeleton() {
  const { t } = useI18n();
  return (
    <>
      <div className="flex h-10 justify-center gap-1.5 rounded-md">
        <div className="flex h-10 w-full items-center justify-center gap-2 rounded-sm px-3 shadow-md bg-card">
          <SearchIcon className="size-5 shrink-0" />
          <input className="h-full w-full bg-card hover:outline-hidden focus:outline-hidden" placeholder={t('search-by-name')} />
          <FilterIcon className="size-5" />
        </div>
      </div>
    </>
  );
}
