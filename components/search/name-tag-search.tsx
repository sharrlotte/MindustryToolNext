'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { FilterIcon, SearchIcon } from '@/components/common/icons';
import OutsideWrapper from '@/components/common/outside-wrapper';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { SearchBar, SearchInput } from '@/components/search/search-input';
import { SortDropdown } from '@/components/search/sort-dropdown';
import TagContainer from '@/components/tag/tag-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

import { defaultSortTag } from '@/constant/env';
import { ContextTagGroup } from '@/context/tags-context';
import useSearchQuery from '@/hooks/use-search-query';
import { cn } from '@/lib/utils';
import { QueryParams } from '@/query/config/search-query-params';
import { ItemPaginationQuery } from '@/query/search-query';
import SortTag, { sortTag } from '@/types/response/SortTag';
import Tag, { Tags } from '@/types/response/Tag';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';

const FilterTags = dynamic(() => import('@/components/tag/filter-tags'), { ssr: false });

type NameTagSearchProps = {
  className?: string;
  tags?: ContextTagGroup[];
  useSort?: boolean;
  useTag?: boolean;
};

export default function NameTagSearch({ className, tags = [], useSort = true, useTag = true }: NameTagSearchProps) {
  const [filter, setFilter] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchQuery(ItemPaginationQuery);

  const [page, setPage] = useState(0);
  const [name, setName] = useState('');
  const [sortBy, setSortBy] = useState<SortTag>(defaultSortTag);
  const [filterBy, setFilterBy] = useState<TagGroup[]>([]);
  const [isChanged, setChanged] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);

  const handleShowFilterDialog = useCallback(() => setShowFilterDialog(true), [setShowFilterDialog]);
  const handleHideFilterDialog = useCallback(() => setShowFilterDialog(false), [setShowFilterDialog]);

  useEffect(() => {
    if (tags.length > 0) {
      const { sort: sortString, name: nameString, tags: tagsString, page } = params;

      const tagGroup = tagsString ? TagGroups.parseString(tagsString, tags) : [];

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

      params.set(QueryParams.page, page.toString());

      if (useSort) {
        params.set(QueryParams.sort, sortBy);
      }

      if (name) {
        params.set(QueryParams.name, name);
      }

      if (tags.length != 0) {
        router.replace(`${pathname}?${params.toString()}`);
      }
    };

    if (!showFilterDialog) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, showFilterDialog, filterBy, sortBy]);

  const handleTagGroupChange = useCallback(
    (name: string, values: string[]) => {
      setFilterBy((prev) => {
        const group = prev.find((tag) => tag.name === name);

        if (values.length === 0) {
          return prev.filter((tag) => tag.name !== name);
        }

        if (group) {
          return prev.map((item) => (item.name === name ? { ...item, values } : item));
        } else {
          const result = tags.find((tag) => tag.name === name);

          // Ignore tag that not match with server
          if (result) {
            const t = { ...result, values };
            return [...prev, t];
          }

          return [];
        }
      });
      setChanged(true);
    },

    [tags, setFilterBy],
  );

  function handleSortChange(value: any) {
    if (value && sortTag.includes(value)) {
      setSortBy(value);
      setChanged(true);
    } else {
      setSortBy(defaultSortTag);
      setChanged(true);
    }
  }

  function handleNameChange(value: string) {
    setName(value);
    setChanged(true);
  }

  function handleEditName(event: any) {
    handleNameChange(event.currentTarget.value);
  }

  function handleResetName() {
    handleNameChange('');
    setChanged(true);
  }

  function handleDeleteTag(tag: Tag) {
    setFilterBy((prev) => {
      const group = prev.find((item) => item.name === tag.name);
      if (group) {
        return prev.map((item) =>
          item.name === tag.name
            ? {
                ...item,
                values: group.values.filter((item) => item !== tag.value),
              }
            : item,
        );
      }

      return [...prev];
    });
  }

  const displayTags = useMemo(() => Tags.fromTagGroup(filterBy), [filterBy]);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex justify-center gap-2">
        <SearchBar className="h-10">
          <SearchIcon className="p-1" />
          <SearchInput placeholder="search-by-name" value={name} onChange={handleEditName} onClear={handleResetName} />
        </SearchBar>
        {useTag && (
          <Button className="h-10 border-none bg-secondary shadow-md" title="filter" variant="outline" onClick={handleShowFilterDialog}>
            <FilterIcon className="size-5" />
          </Button>
        )}
      </div>
      <TagContainer tags={displayTags} handleDeleteTag={handleDeleteTag} />
      {useTag && (
        <div
          className={cn('fixed bottom-0 left-0 right-0 top-0 z-50 hidden items-center justify-center backdrop-blur-sm', {
            flex: showFilterDialog,
          })}
        >
          <OutsideWrapper className="flex h-screen w-screen items-center justify-center md:h-5/6 md:w-5/6" onClickOutside={handleHideFilterDialog}>
            <Card className="flex h-full w-full flex-col justify-between gap-2 rounded-none p-4 md:rounded-lg">
              <div className="flex gap-1">
                <SearchBar className="w-full p-1">
                  <SearchIcon className="p-1" />
                  <SearchInput placeholder="filter" value={filter} onChange={(event) => setFilter(event.currentTarget.value)} onClear={() => setFilter('')} />
                </SearchBar>
                {useSort && <SortDropdown sortBy={sortBy} handleSortChange={handleSortChange} />}
              </div>
              <CardContent className="flex h-full w-full flex-col overflow-hidden p-0">
                <ScrollContainer className="overscroll-none">
                  <FilterTags filter={filter} filterBy={filterBy} tags={tags} handleTagGroupChange={handleTagGroupChange} />
                </ScrollContainer>
              </CardContent>
              <CardFooter className="flex justify-end gap-1 p-0">
                <Button onClick={handleHideFilterDialog} variant="primary">
                  {isChanged ? <Tran text="search" /> : <Tran text="close" />}
                </Button>
              </CardFooter>
            </Card>
          </OutsideWrapper>
        </div>
      )}
    </div>
  );
}
