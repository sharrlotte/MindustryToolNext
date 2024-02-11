import Search from '@/components/search/search-input';
import FilterTags from '@/components/tag/filter-tags';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import OutsideWrapper from '@/components/common/outside-wrapper';
import Tag, { Tags } from '@/types/response/Tag';
import TagGroup from '@/types/response/TagGroup';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import TagContainer from '@/components/tag/tag-container';

type NameTagSelectorProps = {
  tags?: TagGroup[];
  value: TagGroup[];
  disabled?: boolean;
  onChange: (value: TagGroup[]) => void;
  hideSelectedTag?: boolean;
};

export default function NameTagSelector({
  tags = [],
  value,
  disabled = false,
  hideSelectedTag,
  onChange,
}: NameTagSelectorProps) {
  const [filter, setFilter] = useState('');
  const [selectedFilterTags, setSelectedFilterTags] =
    useState<TagGroup[]>(value);
  const [showFilterDialog, setShowFilterDialog] = useState(false);

  const handleShowFilterDialog = () => setShowFilterDialog(true);
  const handleHideFilterDialog = () => setShowFilterDialog(false);

  const tagsClone = cloneDeep(tags);

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
        setSelectedFilterTags([...selectedFilterTags]);
      }
    }
  };

  useEffect(() => {
    onChange(selectedFilterTags);
  }, [selectedFilterTags, onChange]);

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Button
          className="w-fit"
          title="Filter"
          disabled={disabled}
          onClick={handleShowFilterDialog}
        >
          Add Tag ({displayTags.length})
        </Button>
        {!hideSelectedTag && (
          <TagContainer tags={displayTags} handleDeleteTag={handleDeleteTag} />
        )}
      </div>
      {showFilterDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <OutsideWrapper
            className="flex h-[100dvh] w-screen items-center justify-center md:h-5/6 md:w-5/6"
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
                <FilterTags
                  filter={filter}
                  selectedFilterTags={selectedFilterTags}
                  tags={tagsClone}
                  handleTagGroupChange={handleTagGroupChange}
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-1 p-0">
                <Button title="close" onClick={handleHideFilterDialog}>
                  Close
                </Button>
              </CardFooter>
            </Card>
          </OutsideWrapper>
        </div>
      )}
    </div>
  );
}
