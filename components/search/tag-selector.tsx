'use client';

import dynamic from 'next/dynamic';
import React, { useCallback, useMemo, useState } from 'react';

import Tran from '@/components/common/tran';
import CreatePresetButton from '@/components/search/create-preset-button';
import Search from '@/components/search/search-input';
import TagPreset from '@/components/search/tag-preset';
import TagContainer from '@/components/tag/tag-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Tag, { Tags } from '@/types/response/Tag';
import TagGroup from '@/types/response/TagGroup';

const FilterTags = dynamic(() => import('@/components/tag/filter-tags'));

type TagSelectorProps = {
  tags?: TagGroup[];
  disabled?: boolean;
  hideSelectedTag?: boolean;
  value: TagGroup[];
  onChange: (fn: (value: TagGroup[]) => TagGroup[]) => void;
};

export default function TagSelector({ tags = [], value, onChange, disabled = false, hideSelectedTag }: TagSelectorProps) {
  const [filter, setFilter] = useState('');

  const [showFilterDialog, setShowFilterDialog] = useState(false);

  const handleShowFilterDialog = useCallback(() => setShowFilterDialog(true), [setShowFilterDialog]);
  const handleHideFilterDialog = useCallback(() => setShowFilterDialog(false), [setShowFilterDialog]);

  const handleTagGroupChange = useCallback(
    (name: string, values: string[]) => {
      onChange((value) => {
        const group = value.find((tag) => tag.name === name);
        if (group) {
          group.values = values;

          return value.map((item) => (item.name === name ? { ...item, values } : item));
        } else {
          const result = tags.find((tag) => tag.name === name);

          // Ignore tag that not match with server
          if (result) {
            const r = { ...result, values };

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
                  values: group.values.filter((item) => item !== tag.value),
                }
              : item,
          );
        }

        return [...value];
      });
    },
    [onChange],
  );

  const displayTags = useMemo(() => Tags.fromTagGroup(value), [value]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button className="w-fit text-nowrap" variant="primary" title="add-tag" disabled={disabled} onClick={handleShowFilterDialog}>
            <Tran text="add-tag" />({displayTags.length})
          </Button>
          <TagPreset onPresetChoose={(value) => onChange(() => value)} />
        </div>
        {!hideSelectedTag && <TagContainer className="justify-start" tags={displayTags} handleDeleteTag={handleDeleteTag} />}
      </div>
      <div className={cn('fixed inset-0 z-50 hidden items-center justify-center backdrop-blur-sm', { flex: showFilterDialog })}>
        <div className="flex h-screen w-screen items-center justify-center md:h-5/6 md:w-5/6">
          <Card className="flex h-full w-full flex-col justify-between gap-2 rounded-none p-4 md:rounded-lg ">
            <div className="flex w-full gap-2">
              <Search className="w-full p-1">
                <Search.Icon className="p-1" />
                <Search.Input value={filter} placeholder="filter" onChange={(event) => setFilter(event.currentTarget.value)} />
              </Search>
            </div>
            <CardContent className="flex h-full w-full flex-col overflow-y-auto overscroll-none p-0 ">
              <FilterTags filter={filter} filterBy={value} tags={tags} handleTagGroupChange={handleTagGroupChange} />
            </CardContent>
            <CardFooter className="flex justify-end gap-1 p-0">
              <CreatePresetButton tags={value} />
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
