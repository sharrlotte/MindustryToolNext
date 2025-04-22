'use client';

import { Identifier } from 'dnd-core';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import CreateGroupInfoDialog from '@/app/[locale]/(main)/admin/setting/tags/create-group-info.dialog';
import CreateTagCategoryDialog from '@/app/[locale]/(main)/admin/setting/tags/create-tag-category.dialog';
import CreateTagDialog from '@/app/[locale]/(main)/admin/setting/tags/create-tag.dialog';
import DeleteGroupInfoDialog from '@/app/[locale]/(main)/admin/setting/tags/delete-group-info.dialog';

import ErrorMessage from '@/components/common/error-message';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import ModFilter from '@/components/search/mod-filter';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { cn, omit } from '@/lib/utils';
import { getTagDetail, getTagGroup, updateGroupInfo, updateTag } from '@/query/tag';
import { Mod } from '@/types/response/Mod';
import { TagDto } from '@/types/response/Tag';
import { TagDetailDto, TagGroupCategoryDto, TagGroupDto } from '@/types/response/TagGroup';

import { useMutation, useQuery } from '@tanstack/react-query';

const DeleteTagDialog = dynamic(() => import('@/app/[locale]/(main)/admin/setting/tags/delete-tag.dialog'));
const UpdateTagDialog = dynamic(() => import('@/app/[locale]/(main)/admin/setting/tags/update-tag.dialog'));

const DeleteTagCategoryDialog = dynamic(() => import('@/app/[locale]/(main)/admin/setting/tags/delete-tag-category.dialog'));
const UpdateTagCategoryDialog = dynamic(() => import('@/app/[locale]/(main)/admin/setting/tags/update-tag-category.dialog'));

export default function PageClient() {
	const [selectedMod, setSelectedMod] = useState<Mod | undefined>(undefined);

	return (
		<div className="space-y-2 h-full flex flex-col">
			<ModFilter value={selectedMod} onValueSelected={setSelectedMod} />
			<ScrollContainer className="space-y-4">
				<div className="rounded-lg space-y-2">
					<Tran className="py-2 text-lg font-semibold" text="tags.group" />
					<TagGroupList />
				</div>
				<div className="rounded-lg space-y-2">
					<Tran className="py-2 text-lg font-semibold" text="tags.category" />
					<TagList modId={selectedMod?.id} />
				</div>
			</ScrollContainer>
			<div className="flex justify-end gap-2">
				<CreateTagCategoryDialog />
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
				<LoadingSpinner />
			</div>
		);
	}

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	return data?.map((group) => <GroupCard key={group.id} group={group} />);
}

type GroupCardProps = {
	group: TagGroupDto;
};

function GroupCard({ group }: GroupCardProps) {
	const { name, categories } = group;
	const axios = useClientApi();
	const [hoverId, setHoverId] = useState<number>();

	const { invalidateByKey } = useQueriesData();

	const { mutate } = useMutation({
		mutationKey: ['tag-group'],
		mutationFn: ({ category1, category2 }: { category1: TagGroupCategoryDto; category2: TagGroupCategoryDto }) => {
			let category1Position = category2.position;
			const category2Position = category1.position;

			if (category1Position === category2Position) {
				category1Position += 1;
			}

			return Promise.all([
				updateGroupInfo(axios, group.id, category1.id, { position: category1Position }),
				updateGroupInfo(axios, group.id, category2.id, { position: category2Position }),
			]);
		},
		onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error.message }),
		onSettled: () => {
			invalidateByKey(['tag-group']);
		},
	});

	function onDrop(dragId: number, hoverId: number) {
		setHoverId(undefined);

		const category1 = categories.find((r) => r.id === dragId);
		const category2 = categories.find((r) => r.id === hoverId);

		if (!category1 || !category2) {
			throw new Error('Role not found');
		}

		mutate({ category1, category2 });
	}
	return (
		<div className="p-4 bg-card rounded-lg grid md:grid-cols-[128px_1fr] gap-2">
			<Tran className="text-lg" text={name} />
			<div className="flex gap-2 flex-wrap">
				<DndProvider backend={HTML5Backend}>
					{categories
						.sort((a, b) => a.position - b.position)
						.map((category) => (
							<GroupCategoryCard
								isHovered={category.id === hoverId}
								key={category.id}
								group={group}
								category={category}
								onDrop={onDrop}
								onHover={setHoverId}
							/>
						))}
				</DndProvider>
				<CreateGroupInfoDialog group={group} />
			</div>
		</div>
	);
}

type GroupCategoryCardProps = {
	group: TagGroupDto;
	category: TagGroupCategoryDto;
	isHovered: boolean;
	onDrop: (dragIndex: number, hoverIndex: number) => void;
	onHover: (hoverIndex: number) => void;
};

function GroupCategoryCard({ group, category, isHovered, onDrop, onHover }: GroupCategoryCardProps) {
	const { id } = category;

	const ref = useRef<HTMLDivElement>(null);

	const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
		accept: group.id.toString(),
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			};
		},
		drop(item: DragItem) {
			if (!ref.current) {
				return;
			}
			const dragId = item.id;
			const hoverId = id;

			onDrop(dragId, hoverId);
		},
		hover() {
			if (!ref.current) {
				return;
			}

			const hoverIndex = id;

			onHover(hoverIndex);
		},
	});

	const [{ isDragging }, drag] = useDrag({
		type: group.id.toString(),
		item: () => {
			return { id };
		},
		collect: (monitor: any) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	drag(drop(ref));

	return (
		<div
			className={cn('p-2 bg-secondary rounded-lg text-sm text-muted-foreground group border flex group', {
				'border-success border': isHovered,
				'border-destructive border opacity-50': isDragging,
			})}
			style={{ color: category.color }}
			ref={ref}
			data-handler-id={handlerId}
		>
			<Tran className="text-nowrap group-hover:mr-2" text={`tags.${category.name}`} />
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
				<LoadingSpinner />
			</div>
		);
	}

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	return data?.map((category) => <TagCategoryCard key={category.id} category={category} modId={modId} />);
}

type TagCategoryCardProps = {
	category: TagDetailDto;
	modId?: string;
};

function TagCategoryCard({ category, modId }: TagCategoryCardProps) {
	const { color, name, values } = category;

	const { invalidateByKey } = useQueriesData();
	const [hoverId, setHoverId] = useState<number>();
	const axios = useClientApi();

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
		setHoverId(undefined);

		const tag1 = values.find((r) => r.id === dragId);
		const tag2 = values.find((r) => r.id === hoverId);

		if (!tag1 || !tag2) {
			throw new Error('Role not found');
		}

		mutate({ tag1: omit(tag1, 'icon'), tag2: omit(tag2, 'icon') });
	}

	return (
		<div className="grid p-4 gap-2 rounded-lg grid-cols-[128px_auto_40px] bg-card items-start">
			<Tran className="overflow-hidden text-ellipsis text-lg" style={{ color }} text={name} />
			<div className="flex flex-wrap gap-2">
				<DndProvider backend={HTML5Backend}>
					{values.map((tag) => (
						<TagCard key={tag.id} isHovered={hoverId === tag.id} tag={tag} onDrop={onDrop} onHover={setHoverId} />
					))}
					<CreateTagDialog key={modId} categoryId={category.id} modId={modId} />
				</DndProvider>
			</div>
			<EllipsisButton className="p-0" variant="ghost">
				<UpdateTagCategoryDialog category={category} />
				<DeleteTagCategoryDialog category={category} />
			</EllipsisButton>
		</div>
	);
}

interface DragItem {
	id: number;
	type: string;
}

type TagCardProps = {
	tag: TagDto;
	isHovered: boolean;
	onDrop: (dragId: number, hoverId: number) => void;
	onHover: (hoverIndex: number) => void;
};

function TagCard({ tag, isHovered, onDrop, onHover }: TagCardProps) {
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
			const dragId = item.id;
			const hoverId = id;

			onDrop(dragId, hoverId);
		},
		hover() {
			if (!ref.current) {
				return;
			}

			const hoverIndex = id;

			onHover(hoverIndex);
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

	drag(drop(ref));
	return (
		<div
			className={cn('flex text-sm gap-2 px-2 rounded-lg bg-secondary text-muted-foreground items-center border', {
				'border-success border': isHovered,
				'border-destructive border opacity-50': isDragging,
			})}
			ref={ref}
			data-handler-id={handlerId}
		>
			{icon && <Image className="size-6 rounded-lg" width={40} height={40} src={icon} alt={name} />}
			<Tran text={name} />
			<div className="ml-auto">
				<EllipsisButton variant="ghost" className="p-0 text-muted-foreground">
					<UpdateTagDialog tag={tag} />
					<DeleteTagDialog tag={tag} />
				</EllipsisButton>
			</div>
		</div>
	);
}
