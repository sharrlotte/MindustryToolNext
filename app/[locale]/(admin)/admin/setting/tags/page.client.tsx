'use client';

import Image from 'next/image';
import React from 'react';

import CreateTagDialog from '@/app/[locale]/(admin)/admin/setting/tags/create-tag-dialog';

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
    queryKey: ['tags-detail'],
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
    <div className="space-y-2 h-full flex flex-col">
      <ModFilter />
      <ScrollContainer className="h-full overflow-y-auto space-y-2">{data?.map((tag) => <TagCard key={tag.id} tag={tag} />)}</ScrollContainer>
      <div className="flex justify-end">
        <CreateTagDialog />
      </div>
    </div>
  );
}

type TagCardProps = {
  tag: TagDto;
};

function TagCard({ tag: { icon, name, modId, categoryId } }: TagCardProps) {
  return (
    <div className="flex gap-2 p-4 border rounded-lg bg-card">
      {icon && <Image className="w-10 h-10 rounded-full" src={icon} alt={name} />}
      <div className="flex flex-col">
        <Tran className="font-semibold text-sm" text={name} />
      </div>
      <CategoryCard categoryId={categoryId} />
      {modId && <ModCard modId={modId} />}
    </div>
  );
}

type ModCardProps = {
  modId: string;
};

function ModCard({ modId }: ModCardProps) {
  return <div className="text-muted-foreground">{modId}</div>;
}

type CategoryCardProps = {
  categoryId: string;
};

function CategoryCard({ categoryId }: CategoryCardProps) {
  return <div className="text-muted-foreground">{categoryId}</div>;
}
