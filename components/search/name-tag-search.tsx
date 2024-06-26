import _ from 'lodash';
import { cloneDeep } from 'lodash';
import { FilterIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import ComboBox from '@/components/common/combo-box';
import OutsideWrapper from '@/components/common/outside-wrapper';
import Search from '@/components/search/search-input';
import FilterTags from '@/components/tag/filter-tags';
import TagContainer from '@/components/tag/tag-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { TAG_SEPARATOR } from '@/constant/constant';
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
  const [selectedFilterTags, setSelectedFilterTags] = useState<TagGroup[]>([]);
  const [selectedSortTag, setSelectedSortTag] =
    useState<SortTag>(defaultSortTag);
  const [filter, setFilter] = useState('');
  const [isChanged, setChanged] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);

  const handleShowFilterDialog = () => setShowFilterDialog(true);
  const handleHideFilterDialog = () => setShowFilterDialog(false);

  const tagsClone = cloneDeep(tags);

  useEffect(() => {
    if (tags.length > 0) {
      const {
        sort: sortString,
        name: nameString,
        tags: tagsString,
        page,
      } = searchParams;

      const tagsArray = _.chain(tagsString)
        .map((value) => value.split(TAG_SEPARATOR))
        .filter((value) => value.length === 2)
        .map((value) => ({ name: value[0], value: value[1] }))
        .groupBy((value) => value.name)
        .map((value, key) => ({ name: key, value: value.map((v) => v.value) }))
        .map((tag) => {
          let result = tagsClone.find(
            (t) =>
              t.name === tag.name &&
              tag.value.every((b) => tag.value.includes(b)),
          );
          // Ignore tag that not match with server
          if (result) {
            result.value = tag.value;
          }

          return result;
        })
        .compact()
        .value();

      setPage(page);
      setSelectedSortTag(sortString ?? defaultSortTag);
      setSelectedFilterTags(tagsArray);
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
        selectedFilterTags
          .map((group) =>
            group.value.map((value) => `${group.name}${TAG_SEPARATOR}${value}`),
          )
          .forEach((values) =>
            values.forEach((value) => params.append(QueryParams.tags, value)),
          );
      }
      params.set(QueryParams.page, page.toString());

      if (useSort) {
        params.set(QueryParams.sort, selectedSortTag);
      }

      if (name) {
        params.set(QueryParams.name, name);
      }

      router.replace(`${pathname}?${params.toString()}`);
    };

    if (!showFilterDialog) {
      timeout = setTimeout(() => handleSearch(), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, showFilterDialog, selectedFilterTags, selectedSortTag]);

  const handleTagGroupChange = (name: string, value: string[]) => {
    const group = selectedFilterTags.find((tag) => tag.name === name);
    if (group) {
      group.value = value;
      setSelectedFilterTags([...selectedFilterTags]);
    } else {
      let result = tagsClone.find((tag) => tag.name === name);

      // Ignore tag that not match with server
      if (result) {
        result.value = value;
        selectedFilterTags.push(result);
        setChanged(true);
        setSelectedFilterTags([...selectedFilterTags]);
      }
    }
  };

  const handleSortChange = (value: any) => {
    if (value && sortTag.includes(value)) {
      setSelectedSortTag(value);
      setChanged(true);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setChanged(true);
  };

  const handleDeleteTag = (tag: Tag) => {
    setSelectedFilterTags((prev) => {
      const group = prev.find((item) => item.name === tag.name);
      if (group) {
        group.value = group.value.filter((item) => item !== tag.value);
      }

      return [...prev];
    });
  };

  const displayTags = Tags.fromTagGroup(selectedFilterTags);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex justify-center gap-2">
        <Search className="w-full">
          <Search.Icon className="p-1" />
          <Search.Input
            placeholder={t('search-by-name')}
            defaultValue={name}
            onChange={(event) => handleNameChange(event.currentTarget.value)}
          />
        </Search>
        {useSort && (
          <ComboBox
            value={{
              // @ts-ignore
              label: t(selectedSortTag.toLowerCase()),
              value: selectedSortTag,
            }}
            values={sortTagGroup.value.map((value) => ({
              // @ts-ignore
              label: t(value.toLowerCase()),
              value: value as SortTag,
            }))}
            onChange={(value) => handleSortChange(value ?? defaultSortTag)}
            searchBar={false}
          />
        )}
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
      {showFilterDialog && useTag && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <OutsideWrapper
            className="flex h-screen w-screen items-center justify-center md:h-4/5 md:w-4/5"
            onClickOutside={handleHideFilterDialog}
          >
            <Card className="flex h-full w-full flex-col justify-between gap-2 rounded-none p-4 md:rounded-lg ">
              <Search className="w-full p-1">
                <Search.Icon className="p-1" />
                <Search.Input
                  defaultValue={filter}
                  placeholder={t('filter')}
                  onChange={(event) => setFilter(event.currentTarget.value)}
                />
              </Search>
              <CardContent className="flex h-full w-full flex-col overflow-y-auto overscroll-none p-0 ">
                <FilterTags
                  filter={filter}
                  selectedFilterTags={selectedFilterTags}
                  tags={tagsClone}
                  handleTagGroupChange={handleTagGroupChange}
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-1 p-0">
                <Button title={t('close')} onClick={handleHideFilterDialog}>
                  {isChanged ? t('search') : t('close')}
                </Button>
              </CardFooter>
            </Card>
          </OutsideWrapper>
        </div>
      )}
    </div>
  );
}
