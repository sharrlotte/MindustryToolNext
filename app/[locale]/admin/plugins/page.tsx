'use client';

import InfinitePage from '@/components/common/infinite-page';
import PluginCard from '@/components/plugin/plugin-card';
import NameTagSearch from '@/components/search/name-tag-search';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { useSearchTags } from '@/hooks/use-tags';
import { useI18n } from '@/locales/client';
import getPlugins from '@/query/plugin/get-plugins';
import Link from 'next/link';
import React, { useRef } from 'react';

export default function Page() {
  const { plugin } = useSearchTags();
  const params = useSearchPageParams();
  const container = useRef<HTMLDivElement | null>();

  const t = useI18n();

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <NameTagSearch tags={plugin} useSort={false} />
      <div
        className="relative flex h-full flex-col overflow-y-auto"
        ref={(ref) => {
          container.current = ref;
        }}
      >
        <InfinitePage
          className="flex flex-col gap-2"
          queryKey={['plugins']}
          getFunc={getPlugins}
          params={params}
          container={container.current}
        >
          {(data) => <PluginCard key={data.id} plugin={data} />}
        </InfinitePage>
      </div>
      <div className="flex justify-end">
        <Link
          className="rounded-md bg-button p-2 text-sm text-background dark:text-foreground"
          href="/upload/plugin"
          title="Add plugin"
        >
          {t('plugin.add')}
        </Link>
      </div>
    </div>
  );
}
