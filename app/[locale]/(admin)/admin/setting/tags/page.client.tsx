'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useState } from 'react';

import CreateGroupInfoDialog from '@/app/[locale]/(admin)/admin/setting/tags/create-group-info-dialog';
import CreateTagCategoryDialog from '@/app/[locale]/(admin)/admin/setting/tags/create-tag-category-dialog';
import CreateTagDialog from '@/app/[locale]/(admin)/admin/setting/tags/create-tag-dialog';
import DeleteGroupInfoDialog from '@/app/[locale]/(admin)/admin/setting/tags/delete-group-info-dialog';

import RouterSpinner from '@/components/common/router-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import ModFilter from '@/components/search/mod-filter';
import Divider from '@/components/ui/divider';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { Skeleton } from '@/components/ui/skeleton';

import useClientApi from '@/hooks/use-client';
import { groupBy } from '@/lib/utils';
import { getTagCategory, getTagDetail, getTagGroup } from '@/query/tag';
import { Mod } from '@/types/response/Mod';
import { TagDto } from '@/types/response/Tag';
import { TagCategoryDto, TagGroupDto } from '@/types/response/TagGroup';

import { useQuery } from '@tanstack/react-query';

const DeleteTagDialog = dynamic(() => import('@/app/[locale]/(admin)/admin/setting/tags/delete-tag-dialog'));
const UpdateTagDialog = dynamic(() => import('@/app/[locale]/(admin)/admin/setting/tags/update-tag-dialog'));
const DeleteTagCategoryDialog = dynamic(() => import('@/app/[locale]/(admin)/admin/setting/tags/delete-tag-category-dialog'));
const UpdateTagCategoryDialog = dynamic(() => import('@/app/[locale]/(admin)/admin/setting/tags/update-tag-category-dialog'));

export default function PageClient() {
  const [selectedMod, setSelectedMod] = useState<Mod | undefined>(undefined);

  return (
    <div className="space-y-2 h-full flex flex-col">
      <ModFilter value={selectedMod} onValueSelected={setSelectedMod} />
      <ScrollContainer className="space-y-2">
        <TagGroupList />
        <Divider />
        <TagList modId={selectedMod?.id} />
      </ScrollContainer>
      <div className="flex justify-end gap-2">
        <CreateTagCategoryDialog />
        <CreateTagDialog />
      </div>
    </div>
  );
}

function TagGroupList() {
  const axios = useClientApi();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tag-group'],
    queryFn: async () => getTagGroup(axios),
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

  return data?.map((group) => <GroupCard key={group.id} group={group} />);
}

type GroupCardProps = {
  group: TagGroupDto;
};

function GroupCard({ group }: GroupCardProps) {
  const { name, categories } = group;
  return (
    <div className="p-4 bg-card rounded-lg grid md:grid-cols-[128px_1fr] gap-2 border">
      <Tran className="text-lg font-semibold" text={name} />
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <GroupCategoryCard key={category.id} group={group} category={category} />
        ))}
        <CreateGroupInfoDialog group={group} />
      </div>
    </div>
  );
}

type GroupCategoryCardProps = {
  group: TagGroupDto;
  category: TagCategoryDto;
};

function GroupCategoryCard({ group, category }: GroupCategoryCardProps) {
  return (
    <div className="p-2 bg-secondary rounded-lg border text-sm text-muted-foreground group flex hover:gap-2">
      <Tran className="text-nowrap" text={`tags.${category.name}`} />
      <DeleteGroupInfoDialog group={group} category={category} />
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

  return groups.map(({ key: categoryId, value: tags }) => <TagGroupCard key={categoryId} categoryId={categoryId} tags={tags} />);
}

type TagGroupCardProps = {
  categoryId: number;
  tags: TagDto[];
};

function TagGroupCard({ categoryId, tags }: TagGroupCardProps) {
  return (
    <div className="grid md:grid-cols-[128px_1fr] gap-2 p-4 rounded-lg bg-card border">
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

  const { name, color } = data;

  return (
    <div className="flex justify-start flex-col items-start">
      <Tran className="overflow-hidden text-ellipsis font-semibold text-lg" style={{ color }} text={name} />
      <EllipsisButton className="p-0" variant="ghost">
        <UpdateTagCategoryDialog category={data} />
        <DeleteTagCategoryDialog category={data} />
      </EllipsisButton>
    </div>
  );
}
