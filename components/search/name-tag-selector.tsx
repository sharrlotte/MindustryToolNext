'use client';

import React, { useCallback, useState } from 'react';

import OutsideWrapper from '@/components/common/outside-wrapper';
import Search from '@/components/search/search-input';
import FilterTags from '@/components/tag/filter-tags';
import TagContainer from '@/components/tag/tag-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useI18n } from '@/i18n/client';
import Tag, { Tags } from '@/types/response/Tag';
import TagGroup from '@/types/response/TagGroup';
import { cn } from '@/lib/utils';

type NameTagSelectorProps = {
  tags?: TagGroup[];
  disabled?: boolean;
  hideSelectedTag?: boolean;
  value: TagGroup[];
  onChange: (value: TagGroup[]) => void;
};

export default function NameTagSelector({
  tags = [],
  value,
  onChange,
  disabled = false,
  hideSelectedTag,
}: NameTagSelectorProps) {
  const [filter, setFilter] = useState('');

  const [showFilterDialog, setShowFilterDialog] = useState(false);

  const handleShowFilterDialog = () => setShowFilterDialog(true);
  const handleHideFilterDialog = () => setShowFilterDialog(false);

  const t = useI18n();

  const handleTagGroupChange = useCallback(
    (name: string, values: string[]) => {
      const group = value.find((tag) => tag.name === name);
      if (group) {
        group.values = values;
        onChange([...value]);
      } else {
        const result = tags.find((tag) => tag.name === name);

        // Ignore tag that not match with server
        if (result) {
          const r = { ...result, values };
          onChange([...value, r]);
        }
      }
    },
    [value, tags, onChange],
  );

  const handleDeleteTag = useCallback(
    (tag: Tag) => {
      const group = value.find((item) => item.name === tag.name);
      if (group) {
        group.values = group.values.filter((item) => item !== tag.value);
      }

      onChange([...value]);
    },
    [value, onChange],
  );

  const displayTags = Tags.fromTagGroup(value);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Button
          className="w-fit text-nowrap"
          variant="primary"
          title={t('add-tag')}
          disabled={disabled}
          onClick={handleShowFilterDialog}
        >
          {t('add-tag')} ({displayTags.length})
        </Button>
        {!hideSelectedTag && (
          <TagContainer
            className="justify-start"
            tags={displayTags}
            handleDeleteTag={handleDeleteTag}
          />
        )}
      </div>
      <div
        className={cn(
          'fixed inset-0 z-50 hidden items-center justify-center backdrop-blur-sm',
          { flex: showFilterDialog },
        )}
      >
        <OutsideWrapper
          className="flex h-screen w-screen items-center justify-center md:h-5/6 md:w-5/6"
          onClickOutside={handleHideFilterDialog}
        >
          <Card className="flex h-full w-full flex-col justify-between gap-2 rounded-none p-4 md:rounded-lg ">
            <Search className="w-full p-1">
              <Search.Icon className="p-1" />
              <Search.Input
                value={filter}
                placeholder={t('filter')}
                onChange={(event) => setFilter(event.currentTarget.value)}
              />
            </Search>
            <CardContent className="flex h-full w-full flex-col overflow-y-auto overscroll-none p-0 ">
              <FilterTags
                filter={filter}
                filterBy={value}
                tags={tags}
                handleTagGroupChange={handleTagGroupChange}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-1 p-0">
              <Button
                title={t('close')}
                variant="outline"
                onClick={handleHideFilterDialog}
              >
                {t('close')}
              </Button>
            </CardFooter>
          </Card>
        </OutsideWrapper>
      </div>
    </div>
  );
}
