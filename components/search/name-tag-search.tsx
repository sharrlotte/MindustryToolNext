'use client';

import dynamic from 'next/dynamic';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import ErrorMessage from '@/components/common/error-message';
import { Hidden } from '@/components/common/hidden';
import { FilterIcon, SearchIcon, XIcon } from '@/components/common/icons';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import ModFilter from '@/components/search/mod-filter';
import { SearchBar, SearchInput } from '@/components/search/search-input';
import { SortDropdown } from '@/components/search/sort-dropdown';
import TagSettingDialog from '@/components/search/tag-setting-dialog';
import { FilterTag } from '@/components/tag/filter-tags';
import TagBadgeContainer from '@/components/tag/tag-badge-container';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Divider from '@/components/ui/divider';
import { Separator } from '@/components/ui/separator';
import ColorAsRole from '@/components/user/color-as-role';
import IdUserCard from '@/components/user/id-user-card';
import UserAvatar from '@/components/user/user-avatar';

import { TagType } from '@/constant/constant';
import { defaultSortTag } from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useSearchQuery from '@/hooks/use-search-query';
import useTags from '@/hooks/use-tags';
import { cn } from '@/lib/utils';
import { QueryParams } from '@/query/config/search-query-params';
import { getUsers } from '@/query/user';
import { Mod } from '@/types/response/Mod';
import SortTag, { sortTag } from '@/types/response/SortTag';
import Tag from '@/types/response/Tag';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';
import { ItemPaginationQuery } from '@/types/schema/search-query';

import { useQuery } from '@tanstack/react-query';

const FilterTags = dynamic(() => import('@/components/tag/filter-tags'), { ssr: false });

type NameTagSearchProps = {
	className?: string;
	type: TagType;
	useSort?: boolean;
	useTag?: boolean;
};

export default function NameTagSearch({ className, type, useSort = true, useTag = true }: NameTagSearchProps) {
	const [filter, setFilter] = useState('');
	const [selectedMod, setSelectedMod] = useState<Mod | undefined>(undefined);

	const params = useSearchQuery(ItemPaginationQuery);

	const [page, setPage] = useState(0);
	const [name, setName] = useState('');
	const [sortBy, setSortBy] = useState<SortTag>(defaultSortTag);
	const [filterBy, setFilterBy] = useState<TagGroup[]>([]);
	const [authorId, setAuthorId] = useState<string | null>(null);
	const [isChanged, setChanged] = useState(false);
	const [showFilterDialog, setShowFilterDialog] = useState(false);

	const handleShowFilterDialog = useCallback(() => setShowFilterDialog(true), [setShowFilterDialog]);
	const handleHideFilterDialog = useCallback(() => setShowFilterDialog(false), [setShowFilterDialog]);

	const tags = useTags(type, selectedMod);

	useEffect(() => {
		if (tags.length > 0) {
			const { sort: sortString, name: nameString, tags: tagsString, page, authorId } = params;

			const tagGroup = tagsString ? TagGroups.parseString(tagsString, tags) : [];

			setAuthorId(authorId ?? null);
			setPage(page);
			setSortBy(sortString ?? defaultSortTag);
			setFilterBy(tagGroup);
			setName(nameString ?? '');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tags]);

	useEffect(() => {
		const handleSearch = () => {
			const params = new URLSearchParams();

			if (useTag) {
				TagGroups.toStringArray(filterBy).forEach((value) => params.append(QueryParams.tags, value));
			}

			if (page !== 0) {
				params.set(QueryParams.page, page.toString());
			}

			if (useSort && sortBy !== defaultSortTag) {
				params.set(QueryParams.sort, sortBy);
			}

			if (name) {
				params.set(QueryParams.name, name);
			}

			if (authorId) {
				params.set(QueryParams.authorId, authorId);
			}

			if (tags.length != 0 && isChanged) {
				setChanged(false);
			}

			window.history.replaceState(null, '', `?${params.toString()}`);
		};

		if (!showFilterDialog && isChanged) {
			handleSearch();
		}
	}, [name, showFilterDialog, filterBy, sortBy, useTag, page, useSort, tags.length, isChanged, authorId]);

	const handleTagGroupChange = useCallback(
		(name: string, values: FilterTag[]) => {
			setChanged(true);
			setFilterBy((prev) => {
				const group = prev.find((tag) => tag.name === name);

				if (values.length === 0) {
					return prev.filter((tag) => tag.name !== name);
				}

				if (group) {
					return prev.map((item) => (item.name === name ? { ...item, values: values.map((v) => ({ ...v, count: 0 })) } : item));
				} else {
					const result = tags.find((tag) => tag.name === name);

					// Ignore tag that not match with server
					if (result) {
						const t = { ...result, values: values.map((v) => ({ ...v, count: 0 })) };
						return [...prev, t];
					}

					return [];
				}
			});
		},

		[tags, setFilterBy],
	);

	const handleSortChange = useCallback((value: any) => {
		if (value && sortTag.includes(value)) {
			setSortBy(value);
			setChanged(true);
		} else {
			setSortBy(defaultSortTag);
			setChanged(true);
		}
	}, []);

	const handleNameChange = useCallback((value: string) => {
		setName(value);
		setChanged(true);
	}, []);

	const handleAuthorChange = useCallback((value: string | null) => {
		setAuthorId(value);
		setChanged(true);
	}, []);

	const handleEditName = useCallback(
		(value: any) => {
			handleNameChange(value);
		},
		[handleNameChange],
	);

	const handleResetName = useCallback(() => {
		handleNameChange('');
		setChanged(true);
	}, [handleNameChange]);

	const handleDeleteTag = useCallback((tag: Tag) => {
		setChanged(true);
		setFilterBy((prev) => {
			const group = prev.find((item) => item.name === tag.name);
			if (group) {
				return prev.map((item) =>
					item.name === tag.name
						? {
								...item,
								values: group.values.filter((item) => item.name !== tag.value),
							}
						: item,
				);
			}

			return [...prev];
		});
	}, []);

	return (
		<div className={cn('flex flex-col gap-2 text-sm', className)}>
			<div className="flex justify-center gap-1.5 overflow-hidden rounded-sm">
				<SearchBar className="bg-card overflow-hidden">
					<SearchIcon className="size-5 shrink-0" />
					<TagBadgeContainer tagGroups={filterBy} handleDeleteTag={handleDeleteTag} />
					<SearchInput placeholder="search-by-name" value={name} onChange={handleEditName} onClear={handleResetName} />
				</SearchBar>
				{useTag && (
					<Button className="h-10 shadow-md bg-card ml-auto" title="filter" variant="outline" onClick={handleShowFilterDialog}>
						<FilterIcon className="size-5" />
					</Button>
				)}
			</div>
			<Suspense>
				{useTag && showFilterDialog && (
					<div
						className={cn('fixed bottom-0 left-0 right-0 top-0 z-50 hidden items-center justify-center backdrop-blur-sm', {
							flex: showFilterDialog,
						})}
					>
						<Card className="flex h-screen w-screen items-center md:h-4/5 md:w-4/5 flex-col gap-2 rounded-none p-4 md:rounded-lg">
							<div className="flex gap-1 w-full">
								<SearchBar className="w-full p-1">
									<SearchIcon className="p-1" />
									<SearchInput
										placeholder="filter"
										value={filter}
										onChange={(value) => setFilter(value)}
										onClear={() => setFilter('')}
									/>
								</SearchBar>
								{useSort && <SortDropdown sortBy={sortBy} handleSortChange={handleSortChange} />}
							</div>
							<Separator className="border" orientation="horizontal" />
							<ScrollContainer className="overscroll-none space-y-2">
								<AuthorFilter authorId={authorId} handleAuthorChange={handleAuthorChange} />
								<Separator className="border" orientation="horizontal" />
								<ModFilter value={selectedMod} onValueSelected={setSelectedMod} />
								<FilterTags filter={filter} filterBy={filterBy} tags={tags} handleTagGroupChange={handleTagGroupChange} />
							</ScrollContainer>
							<Divider />
							<CardFooter className="flex w-full justify-between gap-1 p-0">
								<TagSettingDialog />
								<Button onClick={handleHideFilterDialog} variant="primary">
									{isChanged ? <Tran text="search" /> : <Tran text="close" />}
								</Button>
							</CardFooter>
						</Card>
					</div>
				)}
			</Suspense>
		</div>
	);
}

function AuthorFilter({
	authorId,
	handleAuthorChange,
}: {
	authorId: string | null;
	handleAuthorChange: (value: string | null) => void;
}) {
	const [name, setName] = useState('');
	const [debounced] = useDebounceValue(name, 100);
	const axios = useClientApi();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['users', name],
		queryFn: () =>
			getUsers(axios, {
				page: 0,
				size: 20,
				name: debounced,
			}),
	});

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	return (
		<div className="flex gap-2 items-center">
			<Dialog>
				<DialogTrigger asChild>
					<div className="flex gap-2 items-center">
						<Tran className="text-base" text="author" defaultValue="Author" />
						<Button variant="outline">
							{authorId ? <IdUserCard id={authorId} /> : <Tran text="select" defaultValue="Select" />}
						</Button>
					</div>
				</DialogTrigger>
				{authorId && (
					<Button variant="outline" onClick={() => handleAuthorChange(null)}>
						<XIcon />
					</Button>
				)}
				<DialogContent className="p-6">
					<Hidden>
						<DialogTitle />
						<DialogDescription />
					</Hidden>
					<SearchBar className="mt-4">
						<SearchIcon />
						<SearchInput value={name} onChange={setName} />
					</SearchBar>
					{isLoading ? (
						<LoadingSpinner />
					) : (
						<ScrollContainer className="space-y-2 max-h-[50dvh]">
							{data?.map((user) => (
								<div
									className={cn('cursor-pointer p-2 rounded-md bg-secondary', {
										'bg-brand': user.id === authorId,
									})}
									key={user.id}
									onClick={() => handleAuthorChange(user.id === authorId ? null : user.id)}
								>
									<div className="flex h-8 min-h-8 items-end gap-2 overflow-hidden">
										<UserAvatar user={user} />
										<ColorAsRole className="font-semibold capitalize" roles={user.roles}>
											{user.name}
										</ColorAsRole>
									</div>
								</div>
							))}
						</ScrollContainer>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
