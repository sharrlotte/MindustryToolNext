import _ from 'lodash';
import { FilterIcon, XIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import ComboBox from '@/components/common/combo-box';
import OutsideWrapper from '@/components/common/outside-wrapper';
import Tran from '@/components/common/tran';
import Search from '@/components/search/search-input';
import FilterTags from '@/components/tag/filter-tags';
import TagContainer from '@/components/tag/tag-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { TAG_DEFAULT_COLOR, TAG_SEPARATOR } from '@/constant/constant';
import { defaultSortTag } from '@/constant/env';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { QueryParams } from '@/query/config/search-query-params';
import SortTag, { sortTag, sortTagGroup } from '@/types/response/SortTag';
import Tag, { Tags } from '@/types/response/Tag';
import TagGroup from '@/types/response/TagGroup';

type NameTagSearchProps = {
  className?: string;
  tags?: TagGroup[];
  useSort?: boolean;
  useTag?: boolean;
};

let timeout: NodeJS.Timeout | undefined;

export default function NameTagSearch({
  className,
  tags = [],
  useSort = true,
  useTag = true,
}: NameTagSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchPageParams();
  const t = useI18n();

  const [page, setPage] = useState(0);
  const [name, setName] = useState('');
  const [filterBy, setFilterBy] = useState<TagGroup[]>([]);
  const [sortBy, setSortBy] = useState<SortTag>(defaultSortTag);
  const [filter, setFilter] = useState('');
  const [isChanged, setChanged] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);

  const handleShowFilterDialog = useCallback(
    () => setShowFilterDialog(true),
    [setShowFilterDialog],
  );
  const handleHideFilterDialog = useCallback(
    () => setShowFilterDialog(false),
    [setShowFilterDialog],
  );

  useEffect(() => {
    if (tags.length > 0) {
      const {
        sort: sortString,
        name: nameString,
        tags: tagsString,
        page,
      } = searchParams;

      const tagsArray: TagGroup[] = _.chain(tagsString)
        .map((value) => value.split(TAG_SEPARATOR))
        .filter((value) => value.length === 2)
        .map((value) => ({ name: value[0], value: value[1] }))
        .groupBy((value) => value.name)
        .map((value, key) => ({ name: key, values: value.map((v) => v.value) }))
        .map((tag) => {
          if (tags.length === 0) {
            return { ...tag, color: TAG_DEFAULT_COLOR, duplicate: true };
          }

          const result = tags.find(
            (t) =>
              t.name === tag.name &&
              tag.values.every((b) => tag.values.includes(b)),
          );
          // Ignore tag that not match with server
          if (result) {
            result.values = { ...tag.values };
          }

          return result;
        })
        .compact()
        .value();

      setPage(page);
      setSortBy(sortString ?? defaultSortTag);
      setFilterBy(tagsArray);
      setName(nameString ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }

    const handleSearch = () => {
      const params = new URLSearchParams();

      if (useTag) {
        filterBy
          .map((group) =>
            group.values.map(
              (value) => `${group.name}${TAG_SEPARATOR}${value}`,
            ),
          )
          .forEach((values) =>
            values.forEach((value) => params.append(QueryParams.tags, value)),
          );
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
      timeout = setTimeout(() => handleSearch(), 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, showFilterDialog, filterBy, sortBy]);

  const handleTagGroupChange = useCallback(
    (name: string, values: string[]) => {
      const group = filterBy.find((tag) => tag.name === name);
      if (group) {
        group.values = values;
        setFilterBy([...filterBy]);
      } else {
        const result = tags.find((tag) => tag.name === name);

        // Ignore tag that not match with server
        if (result) {
          const t = { ...result };
          t.values = values;
          filterBy.push(t);
          setChanged(true);
          setFilterBy([...filterBy]);
        }
      }
    },
    [filterBy, setChanged, setFilterBy],
  );

  function handleSortChange(value: any) {
    if (value && sortTag.includes(value)) {
      setSortBy(value);
      setChanged(true);
    }
  }

  function handleNameChange(value: string) {
    setName(value);
    setChanged(true);
  }

  function handleDeleteTag(tag: Tag) {
    setFilterBy((prev) => {
      const group = prev.find((item) => item.name === tag.name);
      if (group) {
        group.values = group.values.filter((item) => item !== tag.value);
      }

      return [...prev];
    });
  }

  const displayTags = useMemo(() => Tags.fromTagGroup(filterBy), [filterBy]);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex justify-center gap-2">
        <Search>
          <Search.Icon className="p-1" />
          <Search.Input
            placeholder={t('search-by-name')}
            value={name}
            onChange={(event) => handleNameChange(event.currentTarget.value)}
          />
          {name && (
            <Button
              className="p-0"
              title="reset"
              onClick={() => handleNameChange('')}
              variant="icon"
            >
              <XIcon />
            </Button>
          )}
        </Search>
        {useTag && (
          <Button
            className="border border-none border-border bg-card shadow-md dark:border-solid dark:bg-transparent"
            title={t('filter')}
            variant="outline"
            onClick={handleShowFilterDialog}
          >
            <FilterIcon className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        )}
      </div>
      <TagContainer tags={displayTags} handleDeleteTag={handleDeleteTag} />
      {useTag && (
        <div
          className={cn(
            'fixed bottom-0 left-0 right-0 top-0 z-50 hidden items-center justify-center backdrop-blur-sm',
            {
              flex: showFilterDialog,
            },
          )}
        >
          <OutsideWrapper
            className="flex h-screen w-screen items-center justify-center md:h-5/6 md:w-5/6"
            onClickOutside={handleHideFilterDialog}
          >
            <Card className="flex h-full w-full flex-col justify-between gap-2 rounded-none p-4 md:rounded-lg">
              <div className="flex gap-1">
                <Search className="w-full p-1">
                  <Search.Icon className="p-1" />
                  <Search.Input
                    placeholder={t('filter')}
                    value={filter}
                    onChange={(event) => setFilter(event.currentTarget.value)}
                  />
                </Search>
                {useSort && (
                  <ComboBox
                    value={{
                      label: t(sortBy.toLowerCase()),
                      value: sortBy,
                    }}
                    values={sortTagGroup.values.map((value) => ({
                      label: t(value.toLowerCase()),
                      value: value as SortTag,
                    }))}
                    onChange={(value) =>
                      handleSortChange(value ?? defaultSortTag)
                    }
                    searchBar={false}
                  />
                )}
              </div>
              <CardContent className="flex h-full w-full flex-col overflow-y-auto overscroll-none p-0 ">
                <FilterTags
                  filter={filter}
                  filterBy={filterBy}
                  tags={tags}
                  handleTagGroupChange={handleTagGroupChange}
                />
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
