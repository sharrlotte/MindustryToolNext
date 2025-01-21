'use client';

import { Identifier } from 'dnd-core';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { groupBy, omit } from '@/lib/utils';
import { getTagCategory, getTagDetail, getTagGroup, updateTag } from '@/query/tag';
import { Mod } from '@/types/response/Mod';
import { TagDto } from '@/types/response/Tag';
import { TagCategoryDto, TagGroupDto } from '@/types/response/TagGroup';

import { useMutation, useQuery } from '@tanstack/react-query';

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

  const { invalidateByKey } = useQueriesData();

  const { mutate } = useMutation({
    mutationKey: ['tags-detail'],
    mutationFn: ({ tag1, tag2 }: { tag1: TagDto; tag2: TagDto }) => {
      const tag1Position = tag1.position;

      tag1.position = tag2.position;
      tag2.position = tag1Position;

      if (tag1.position === tag2.position) {
        tag1.position += 1;
      }

      return Promise.all([updateTag(axios, tag1.id, tag1), updateTag(axios, tag2.id, tag2)]);
    },
    onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error.message }),
    onSettled: () => {
      invalidateByKey(['tags-detail']);
    },
  });

  function onDrop(dragId: number, hoverId: number) {
    if (!data) {
      return;
    }

    const tag1 = data.find((r) => r.id === dragId);
    const tag2 = data.find((r) => r.id === hoverId);

    if (!tag1 || !tag2) {
      throw new Error('Role not found');
    }

    mutate({ tag1: omit(tag1, 'icon'), tag2: omit(tag2, 'icon') });
  }

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

  return groups.map(({ key: categoryId, value: tags }) => <TagGroupCard key={categoryId} categoryId={categoryId} tags={tags} onDrop={onDrop} />);
}

type TagGroupCardProps = {
  tags: TagDto[];
  categoryId: number;
  onDrop: (dragIndex: number, hoverIndex: number) => void;
};

function TagGroupCard({ categoryId, tags, onDrop }: TagGroupCardProps) {
  return (
    <div className="grid md:grid-cols-[128px_1fr] gap-2 p-4 rounded-lg bg-card border">
      <CategoryCard categoryId={categoryId} />
      <div className="flex flex-col flex-grow gap-2">
        <DndProvider backend={HTML5Backend}>
          {tags.map((tag) => (
            <TagCard key={tag.id} tag={tag} onDrop={onDrop} />
          ))}
        </DndProvider>
      </div>
    </div>
  );
}

interface DragItem {
  id: number;
  type: string;
}

type TagCardProps = {
  tag: TagDto;
  onDrop: (dragIndex: number, hoverIndex: number) => void;
};

function TagCard({ tag, onDrop }: TagCardProps) {
  const { id, icon, name, categoryId } = tag;

  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: categoryId.toString(),
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    drop(item: DragItem) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.id;
      const hoverIndex = id;

      onDrop(dragIndex, hoverIndex);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: categoryId.toString(),
    item: () => {
      return { id };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;

  drag(drop(ref));
  return (
    <div className="flex gap-2 p-2 border rounded-lg bg-secondary items-center" ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      {id}
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
