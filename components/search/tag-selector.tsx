'use client';

import dynamic from 'next/dynamic';
import React, { useCallback, useState } from 'react';

import { SearchIcon } from '@/components/common/icons';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import CreatePresetButton from '@/components/search/create-preset-button';
import ModFilter from '@/components/search/mod-filter';
import { SearchBar, SearchInput } from '@/components/search/search-input';
import TagPreset from '@/components/search/tag-preset';
import { FilterTag } from '@/components/tag/filter-tags';
import TagContainer from '@/components/tag/tag-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import useTags from '@/hooks/use-tags';
import { PresetType, cn } from '@/lib/utils';
import { Mod } from '@/types/response/Mod';
import Tag from '@/types/response/Tag';
import TagGroup from '@/types/response/TagGroup';

const FilterTags = dynamic(() => import('@/components/tag/filter-tags'));

type TagSelectorProps = {
  disabled?: boolean;
  hideSelectedTag?: boolean;
  value: TagGroup[];
  type: PresetType;
  onChange: (fn: (value: TagGroup[]) => TagGroup[]) => void;
};

export default function TagSelector({ type, value, onChange, disabled = false, hideSelectedTag }: TagSelectorProps) {
  const [selectedMod, setSelectedMod] = useState<Mod | undefined>(undefined);
  const [filter, setFilter] = useState('');

  const [showFilterDialog, setShowFilterDialog] = useState(false);

  const handleShowFilterDialog = useCallback(() => setShowFilterDialog(true), [setShowFilterDialog]);
  const handleHideFilterDialog = useCallback(() => setShowFilterDialog(false), [setShowFilterDialog]);

  const tags = useTags(type, selectedMod);

  const handleTagGroupChange = useCallback(
    (name: string, values: FilterTag[]) => {
      onChange((value) => {
        const group = value.find((tag) => tag.name === name);
        if (group) {
          group.values = values.map((v) => ({ ...v, count: 0 }));

          return value.map((item) => (item.name === name ? { ...item, values: values.map((v) => ({ ...v, count: 0 })) } : item));
        } else {
          const result = tags.find((tag) => tag.name === name);

          // Ignore tag that not match with server
          if (result) {
            const r = { ...result, values: values.map((v) => ({ ...v, count: 0 })) };

            return [...value, r];
          }

          return [];
        }
      });
    },
    [tags, onChange],
  );

  const handleDeleteTag = useCallback(
    (tag: Tag) => {
      onChange((value) => {
        const group = value.find((item) => item.name === tag.name);

        if (group) {
          return value.map((item) =>
            item.name === tag.name
              ? {
                  ...item,
                  values: group.values.filter((item) => item.name !== tag.value),
                }
              : item,
          );
        }

        return [...value];
      });
    },
    [onChange],
  );

  return (
    <div
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button className="w-fit text-nowrap" variant="primary" title="add-tag" disabled={disabled} onClick={handleShowFilterDialog}>
            <Tran text="add-tag" />
          </Button>
          <TagPreset type={type} onPresetChoose={(value) => onChange(() => value)} />
        </div>
        {!hideSelectedTag && <TagContainer className="justify-start" tagGroups={value} handleDeleteTag={handleDeleteTag} />}
      </div>
      <div className={cn('fixed inset-0 z-50 hidden items-center justify-center backdrop-blur-sm', { flex: showFilterDialog })}>
        <div className="flex h-screen w-screen items-center justify-center md:h-4/5 md:w-4/5">
          <Card className="grid grid-rows-[auto_1fr_auto] h-full w-full gap-2 rounded-none p-4 md:rounded-lg ">
            <SearchBar className="w-full p-1">
              <SearchIcon className="p-1" />
              <SearchInput value={filter} placeholder="filter" onChange={(event) => setFilter(event.currentTarget.value)} onClear={() => setFilter('')} />
            </SearchBar>
            <ScrollContainer className="overscroll-none h-full">
              <ModFilter value={selectedMod} onValueSelected={setSelectedMod} />
              <Separator className="border" orientation="horizontal" />
              <CardContent className="flex h-full w-full flex-col p-0 ">
                <FilterTags filter={filter} filterBy={value} tags={tags} handleTagGroupChange={handleTagGroupChange} />
              </CardContent>
            </ScrollContainer>
            <CardFooter className="flex justify-end gap-1 p-0">
              <CreatePresetButton type={type} tags={value} />
              <Button title="close" variant="outline" onClick={handleHideFilterDialog}>
                <Tran text="close" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
