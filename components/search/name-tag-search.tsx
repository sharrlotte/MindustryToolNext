'use client';

import { FilterIcon, SearchIcon } from 'lucide-react';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useDebounceCallback, useLocalStorage } from 'usehooks-ts';

import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { SearchBar, SearchInput } from '@/components/search/search-input';
import { FilterTag } from '@/components/tag/filter-tags';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import Divider from '@/components/ui/divider';
import { Separator } from '@/components/ui/separator';

import { Mod } from '@/types/response/Mod';
import SortTag, { sortTag } from '@/types/response/SortTag';
import { Tag } from '@/types/response/Tag';
import { TagGroup, TagGroups } from '@/types/response/TagGroup';
import { ItemPaginationQuery } from '@/types/schema/search-query';

import { QueryParams } from '@/query/config/search-query-params';

import useSearchQuery from '@/hooks/use-search-query';
import useTags from '@/hooks/use-tags';

import { TagType } from '@/constant/constant';
import { defaultSortTag } from '@/constant/env';
import { cn } from '@/lib/utils';

import dynamic from 'next/dynamic';

const AuthorFilter = dynamic(() => import('@/components/search/author-filter'));
const ModFilter = dynamic(() => import('@/components/search/mod-filter'));
const SortDropdown = dynamic(() => import('@/components/search/sort-dropdown'));
const TagSettingDialog = dynamic(() => import('@/components/search/tag-setting-dialog'));
const FilterTags = dynamic(() => import('@/components/tag/filter-tags'), { ssr: false });
const TagBadgeContainer = dynamic(() => import('@/components/tag/tag-badge-container'));

type NameTagSearchProps = {
	className?: string;
	type: TagType;
	useSort?: boolean;
	useTag?: boolean;
};

export default function NameTagSearch({ className, type, useSort = true, useTag = true }: NameTagSearchProps) {
	const [filter, setFilter] = useState('');
	const [selectedMod, setSelectedMod] = useLocalStorage<Mod[]>('mods', []);

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
	}, [tags.length]);

	const setPath = useDebounceCallback((params: URLSearchParams) => window.history.replaceState(null, '', `?${params.toString()}`));

	const handleSearch = useCallback(() => {
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

		setChanged(false);
		setPath(params);
	}, [authorId, name, filterBy, page, setPath, sortBy, useSort, useTag]);

	useEffect(() => {
		if (!showFilterDialog && isChanged) {
			handleSearch();
		}
	}, [handleSearch, isChanged, showFilterDialog]);

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
				<SearchBar className="overflow-hidden bg-card">
					<SearchIcon className="size-5 shrink-0" />
					<Suspense>
						{filterBy.length > 0 && <TagBadgeContainer tagGroups={filterBy} handleDeleteTag={handleDeleteTag} />}
					</Suspense>
					<SearchInput placeholder="search-by-name" value={name} onChange={handleNameChange} onClear={handleResetName} />
				</SearchBar>
				{useTag && (
					<Button className="ml-auto h-10 shadow-md bg-card" title="filter" variant="outline" onClick={handleShowFilterDialog}>
						<FilterIcon className="size-5" />
					</Button>
				)}
			</div>
			<Suspense>
				{useTag && showFilterDialog && (
					<div className="fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center backdrop-blur-sm">
						<Card className="flex flex-col gap-2 items-center p-4 w-screen h-screen rounded-none md:h-4/5 md:w-4/5 md:rounded-lg">
							<div className="flex gap-1 w-full">
								<SearchBar className="p-1 w-full">
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
							<ScrollContainer id="tag-container" className="overscroll-none space-y-2">
								<AuthorFilter authorId={authorId} handleAuthorChange={handleAuthorChange} />
								<Separator className="border" orientation="horizontal" />
								<ModFilter multiple value={selectedMod} onValueSelected={setSelectedMod} />
								<FilterTags filter={filter} filterBy={filterBy} tags={tags} handleTagGroupChange={handleTagGroupChange} />
							</ScrollContainer>
							<Divider />
							<CardFooter className="flex gap-1 justify-between px-0 pt-1 pb-0 w-full border-t mt-auto">
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
