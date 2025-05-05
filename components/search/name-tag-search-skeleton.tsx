'use client';

import React from 'react';

import { FilterIcon, SearchIcon } from '@/components/common/icons';

import { useI18n } from '@/i18n/client';

export default function NameTagSearchSkeleton() {
	const { t } = useI18n();
	return (
		<>
			<div className="flex h-10 justify-center gap-1.5 rounded-md">
				<div className="relative flex h-10 w-full items-center justify-center gap-2 rounded-md border pl-2 shadow-md bg-card overflow-hidden">
					<SearchIcon className="size-5 shrink-0" />
					<input className="h-full w-full bg-card hover:outline-none focus:outline-none" placeholder={t('search-by-name')} />
				</div>
				<div className="inline-flex items-center gap-2 justify-center rounded-md text-sm font-medium transition-colors text-nowrap border border-border hover:bg-accent hover:text-accent-foreground px-4 py-2 h-10 shadow-md bg-card ml-auto">
					<FilterIcon className="size-5" />
				</div>
			</div>
		</>
	);
}
