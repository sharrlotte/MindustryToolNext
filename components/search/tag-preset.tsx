'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { Hidden } from '@/components/common/hidden';
import { SearchIcon, XIcon } from '@/components/common/icons';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { SearchBar, SearchInput } from '@/components/search/search-input';
import TagContainer from '@/components/tag/tag-container';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import useQueriesData from '@/hooks/use-queries-data';
import TagGroup from '@/types/response/TagGroup';

import { useQuery } from '@tanstack/react-query';
import { PresetType } from '@/constant/constant';
import { getTagPreset, deleteTagPreset } from '@/lib/tag';
import { TagPreset } from '@/types/type';

type TagPresetListProps = {
  type: PresetType;
  onPresetChoose: (tags: TagGroup[]) => void;
};

export default function TagPresetList({ type, onPresetChoose }: TagPresetListProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useLocalStorage('TAG_PRESET_FILTER', '');

  const { data } = useQuery({
    queryFn: () => getTagPreset(type),
    queryKey: ['preset', type],
  });

  const preset = useMemo(() => data?.filter((item) => item.name.includes(filter)) || [], [filter, data]);

  const handlePresetChoose = useCallback(
    (tags: TagGroup[]) => {
      onPresetChoose(JSON.parse(JSON.stringify(tags)));
      setOpen(false);
    },
    [onPresetChoose, setOpen],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">
          <Tran text="preset" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-full max-h-dvh w-full flex-col overflow-hidden p-6 sm:max-w-[calc(100%-24px)]" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogTitle>
          <Tran text="preset" />
        </DialogTitle>
        <Hidden>
          <DialogDescription />
        </Hidden>
        <SearchBar className="w-full p-1">
          <SearchIcon className="p-1" />
          <SearchInput value={filter} placeholder="filter" onChange={(value) => setFilter(value)} onClear={() => setFilter('')} />
        </SearchBar>
        <ScrollContainer className="grid h-fit items-start grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
          {preset.map((item) => (
            <TagPresetCard key={item.name} preset={item} onClick={handlePresetChoose} />
          ))}
        </ScrollContainer>
      </DialogContent>
    </Dialog>
  );
}

type TagPresetCardProps = {
  preset: TagPreset;
  onClick: (tags: TagGroup[]) => void;
};

function TagPresetCard({ preset: { name, tags, type }, onClick }: TagPresetCardProps) {
  const { invalidateByKey } = useQueriesData();

  function handleDeletePreset() {
    deleteTagPreset(name, type);
    invalidateByKey(['preset']);
  }

  function handleClick() {
    onClick([...tags]);
  }

  return (
    <div className="flex cursor-pointer items-start justify-between rounded-sm bg-card p-2">
      <div className="space-y-1" onClick={handleClick}>
        <span className="font-bold">{name}</span>
        <TagContainer tagGroups={tags} />
      </div>
      <Button className="p-0" variant="icon" size="icon" onClick={handleDeletePreset}>
        <XIcon />
      </Button>
    </div>
  );
}
