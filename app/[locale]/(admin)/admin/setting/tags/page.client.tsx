'use client';

import Image from 'next/image';
import React from 'react';

import RouterSpinner from '@/components/common/router-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import ModFilter from '@/components/search/mod-filter';

import useClientApi from '@/hooks/use-client';
import { getTagDetail } from '@/query/tag';
import { TagDto } from '@/types/response/Tag';

import { useQuery } from '@tanstack/react-query';

export default function PageClient() {
  const axios = useClientApi();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['all-tags-detail'],
    queryFn: async () => getTagDetail(axios),
  });

  if (isError) {
    return (
      <div className="col-span-full flex h-full w-full justify-center">
        <RouterSpinner message={error.message} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="col-span-full flex h-full flex-col w-full items-center text-center justify-center">
        <Tran className="font-semibold" text="error" />
        <p className="text-muted-foreground">{JSON.stringify(error)}</p>
      </div>
    );
  }

  return (
    <>
      <ModFilter />
      <ScrollContainer className="h-full overflow-y-auto space-y-2">{data?.map((tag) => <TagCard key={tag.id} tag={tag} />)}</ScrollContainer>;
    </>
  );
}

type TagCardProps = {
  tag: TagDto;
};

function TagCard({ tag: { icon, name } }: TagCardProps) {
  return (
    <div className="flex gap-2 p-4 border rounded-lg">
      {icon && <Image className="w-10 h-10 rounded-full" src={icon} alt={name} />}
      <div className="flex flex-col">
        <Tran className="font-semibold text-sm" text={name} />
      </div>
    </div>
  );
}
