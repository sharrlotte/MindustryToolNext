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
  const scrollContainer = useRef<HTMLDivElement | null>();

  const t = useI18n();

  return (
    <div className="flex h-full flex-col justify-between">
      <div
        className="relative flex h-full flex-col gap-4 overflow-y-auto"
        ref={(ref) => {
          scrollContainer.current = ref;
        }}
      >
        <NameTagSearch tags={plugin} useSort={false} />
        <InfinitePage
          className="flex flex-col gap-2"
          queryKey={['plugins']}
          getFunc={getPlugins}
          params={params}
          scrollContainer={scrollContainer.current}
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
