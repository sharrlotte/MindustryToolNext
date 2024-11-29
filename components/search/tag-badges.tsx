import { useRouter } from 'next/navigation';
import React from 'react';

import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';

import { QueryParams } from '@/query/config/search-query-params';
import SortTag from '@/types/response/SortTag';

type Config = {
  sort?: SortTag;
  tag?: string;
};

type Props = {
  values: Config[];
};

export default function TagBadges({ values }: Props) {
  const router = useRouter();

  function handleSearch({ sort, tag }: Config) {
    const params = new URLSearchParams();

    params.delete(QueryParams.tags);
    params.delete(QueryParams.sort);

    if (tag) {
      params.set(QueryParams.tags, tag);
    }

    if (sort) {
      params.set(QueryParams.sort, sort);
    }

    router.replace(`?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 overflow-x-auto overflow-y-hidden h-12">
      {values.map(({ sort, tag }, index) => (
        <Button className="rounded-full py-1 text-sm" key={index} variant="outline" onClick={() => handleSearch({ sort, tag })}>
          {sort && <Tran text={sort} />}
          {tag && <Tran text={`tags.${tag}`} />}
        </Button>
      ))}
    </div>
  );
}
