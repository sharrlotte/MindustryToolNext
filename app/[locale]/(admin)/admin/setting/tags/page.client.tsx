'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useState } from 'react';

import CreateTagDialog from '@/app/[locale]/(admin)/admin/setting/tags/create-tag-dialog';
import DeleteTagDialog from '@/app/[locale]/(admin)/admin/setting/tags/delete-tag-dialog';

import RouterSpinner from '@/components/common/router-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import ModFilter from '@/components/search/mod-filter';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { Skeleton } from '@/components/ui/skeleton';

import useClientApi from '@/hooks/use-client';
import { groupBy } from '@/lib/utils';
import { getTagCategory, getTagDetail } from '@/query/tag';
import { Mod } from '@/types/response/Mod';
import { TagDto } from '@/types/response/Tag';

import { useQuery } from '@tanstack/react-query';

const UpdateTagDialog = dynamic(() => import('@/app/[locale]/(admin)/admin/setting/tags/update-tag-dialog'));

export default function PageClient() {
  const [selectedMod, setSelectedMod] = useState<Mod | undefined>(undefined);

  return (
    <div className="space-y-2 h-full flex flex-col">
      <ModFilter value={selectedMod} onValueSelected={setSelectedMod} />
      <TagList modId={selectedMod?.id} />
      <div className="flex justify-end">
        <CreateTagDialog />
      </div>
    </div>
  );
}

type TagListProps = {
  modId?: string;
};

function TagList({ modId }: TagListProps) {
  const axios = useClientApi();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tags-detail', modId],
    queryFn: async () => getTagDetail(axios, modId),
  });

  if (isLoading) {
    return (
      <div className="col-span-full flex h-full w-full justify-center">
        <RouterSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="col-span-full flex h-full flex-col w-full items-center text-center justify-center">
        <Tran className="font-semibold" text="error" />
        <p className="text-muted-foreground">{JSON.stringify(error)}</p>
      </div>
    );
  }

  const groups = groupBy(data ?? [], (value) => value.categoryId);

  return (
    <ScrollContainer className="h-full overflow-y-auto space-y-2">
      {groups.map(({ key: categoryId, value: tags }) => (
        <TagGroupCard key={categoryId} categoryId={categoryId} tags={tags} />
      ))}
    </ScrollContainer>
  );
}

type TagGroupCardProps = {
  categoryId: number;
  tags: TagDto[];
};

function TagGroupCard({ categoryId, tags }: TagGroupCardProps) {
  return (
    <div className="flex gap-2 p-4 rounded-lg bg-card flex-wrap">
      <CategoryCard categoryId={categoryId} />
      <div className="flex flex-col flex-grow gap-2">
        {tags.map((tag) => (
          <TagCard key={tag.id} tag={tag} />
        ))}
      </div>
    </div>
  );
}

type TagCardProps = {
  tag: TagDto;
};

function TagCard({ tag }: TagCardProps) {
  const { icon, name } = tag;

  return (
    <div className="flex gap-2 p-2 border rounded-lg bg-secondary items-center">
      {icon && <Image className="w-10 h-10 rounded-lg" width={40} height={40} src={icon} alt={name} />}
      <Tran className="text-sm text-muted-foreground" text={name} />
      <div className="ml-auto">
        <EllipsisButton variant="ghost">
          <UpdateTagDialog tag={tag} />
          <DeleteTagDialog tag={tag} />
        </EllipsisButton>
      </div>
    </div>
  );
}

type CategoryCardProps = {
  categoryId: number;
};

function CategoryCard({ categoryId }: CategoryCardProps) {
  const axios = useClientApi();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tag-category', categoryId],
    queryFn: async () => getTagCategory(axios, categoryId),
  });

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return (
      <div className="col-span-full flex h-full flex-col w-full items-center text-center justify-center">
        <Tran className="font-semibold" text="error" />
        <p className="text-muted-foreground">{JSON.stringify(error)}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { name } = data;

  return <Tran className="w-32 overflow-hidden text-ellipsis" text={name} />;
}
