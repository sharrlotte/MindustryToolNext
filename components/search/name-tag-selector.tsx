'use client';

import { cloneDeep } from 'lodash';
import React, { useState } from 'react';

import OutsideWrapper from '@/components/common/outside-wrapper';
import Search from '@/components/search/search-input';
import FilterTags from '@/components/tag/filter-tags';
import TagContainer from '@/components/tag/tag-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useI18n } from '@/locales/client';
import Tag, { Tags } from '@/types/response/Tag';
import TagGroup from '@/types/response/TagGroup';

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

  const tagsClone = cloneDeep(tags);

  const handleTagGroupChange = (name: string, v: string[]) => {
    const group = value.find((tag) => tag.name === name);
    if (group) {
      group.values = v;
      onChange([...value]);
    } else {
      const result = tagsClone.find((tag) => tag.name === name);

      // Ignore tag that not match with server
      if (result) {
        result.values = v;
        value.push(result);
        onChange([...value]);
      }
    }
  };

  const handleDeleteTag = (tag: Tag) => {
    const group = value.find((item) => item.name === tag.name);
    if (group) {
      group.values = group.values.filter((item) => item !== tag.value);
    }

    onChange([...value]);
  };

  const displayTags = Tags.fromTagGroup(value);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Button
          className="w-fit"
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
      {showFilterDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
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
                  tags={tagsClone}
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
      )}
    </div>
  );
}
