import Search from '@/components/search/search-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import TagGroup from '@/types/response/TagGroup';
import { FilterIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import SortTag, { sortTag, sortTagGroup } from '@/types/response/SortTag';
import Tag, { Tags } from '@/types/response/Tag';
import { defaultSortTag } from '@/constant/env';
import { usePathname, useRouter } from 'next/navigation';
import TagCard from '@/components/tag/tag-card';
import { QueryParams } from '@/query/config/search-query-params';
import OutsideWrapper from '@/components/common/outside-wrapper';
import useSearchPageParams from '@/hooks/use-search-page-params';
import FilterTags from '@/components/tag/filter-tags';
import SortTags from '@/components/tag/sort-tags';
import { TAG_SEPARATOR } from '@/constant/constant';
import { cn } from '@/lib/utils';
import _ from 'lodash';

type NameTagSearchProps = {
  className?: string;
  tags?: TagGroup[];
};

let timeout: NodeJS.Timeout | undefined;

export default function NameTagSearch({
  className,
  tags = [],
}: NameTagSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchPageParams();

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

      setSelectedSortTag(sortString);
      setSelectedFilterTags(tagsArray);
      setName(nameString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

  useEffect(() => {
    if (timeout) {
      clearTimeout(timeout);
    }

    const handleSearch = () => {
      const params = new URLSearchParams();
      selectedFilterTags
        .map((group) =>
          group.value.map((value) => `${group.name}${TAG_SEPARATOR}${value}`),
        )
        .forEach((values) =>
          values.forEach((value) => params.append(QueryParams.tags, value)),
        );

      params.set(QueryParams.sort, selectedSortTag);
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
        <Search className="w-full md:w-1/2">
          <Search.Icon className="p-1" />
          <Search.Input
            placeholder="Search with name"
            defaultValue={name}
            onChange={(event) => handleNameChange(event.currentTarget.value)}
          />
        </Search>
        <Button
          title="Filter"
          variant="outline"
          onClick={handleShowFilterDialog}
        >
          <FilterIcon />
        </Button>
      </div>
      {displayTags.length > 0 && (
        <section className="m-auto flex w-full flex-wrap items-center justify-center gap-1 md:w-3/4">
          {displayTags.map((item) => (
            <TagCard
              key={item.name + item.value}
              tag={item}
              onDelete={handleDeleteTag}
            />
          ))}
        </section>
      )}
      {showFilterDialog && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <OutsideWrapper
            className="flex h-[100dvh] w-screen items-center justify-center md:h-4/5 md:w-4/5"
            onClickOutside={handleHideFilterDialog}
          >
            <Card className="flex h-full w-full flex-col justify-between gap-2 rounded-none p-4 md:rounded-lg ">
              <Search className="w-full p-1">
                <Search.Icon className="p-1" />
                <Search.Input
                  defaultValue={filter}
                  placeholder="Filter out tags"
                  onChange={(event) => setFilter(event.currentTarget.value)}
                />
              </Search>
              <CardContent className="flex h-full w-full flex-col overflow-y-auto overscroll-none p-0 ">
                <SortTags
                  filter={filter}
                  selectedSortTag={selectedSortTag}
                  tag={sortTagGroup}
                  handleSortChange={handleSortChange}
                />
                <FilterTags
                  filter={filter}
                  selectedFilterTags={selectedFilterTags}
                  tags={tagsClone}
                  handleTagGroupChange={handleTagGroupChange}
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-1 p-0">
                <Button title="close" onClick={handleHideFilterDialog}>
                  {isChanged ? 'Search' : 'Close'}
                </Button>
              </CardFooter>
            </Card>
          </OutsideWrapper>
        </div>
      )}
    </div>
  );
}
