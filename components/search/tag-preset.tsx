'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { Hidden } from '@/components/common/hidden';
import { XIcon } from '@/components/common/icons';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import Search from '@/components/search/search-input';
import TagContainer from '@/components/tag/tag-container';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import useQueriesData from '@/hooks/use-queries-data';
import { TagPreset, deleteTagPreset, getTagPreset } from '@/lib/utils';
import { Tags } from '@/types/response/Tag';
import TagGroup from '@/types/response/TagGroup';

import { useQuery } from '@tanstack/react-query';

type TagPresetListProps = {
  onPresetChoose: (tags: TagGroup[]) => void;
};

export default function TagPresetList({ onPresetChoose }: TagPresetListProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const { data } = useQuery({
    queryFn: () => getTagPreset(),
    queryKey: ['preset'],
  });

  const preset = useMemo(() => data?.filter((item) => item.name.includes(filter)) || [], [filter, data]);

  const handlePresetChoose = useCallback(
    (tags: TagGroup[]) => {
      onPresetChoose(tags);
      setOpen(false);
    },
    [onPresetChoose, setOpen],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">
          <Tran text="tags.preset" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-full max-h-dvh w-full flex-col overflow-hidden p-6 sm:max-w-[calc(100%-24px)]">
        <DialogTitle>
          <Tran text="tags.preset" />
        </DialogTitle>
        <Hidden>
          <DialogDescription />
        </Hidden>
        <Search className="w-full p-1">
          <Search.Icon className="p-1" />
          <Search.Input value={filter} placeholder="filter" onChange={(event) => setFilter(event.currentTarget.value)} />
        </Search>
        <ScrollContainer className="grid grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2">
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

function TagPresetCard({ preset: { name, tags }, onClick }: TagPresetCardProps) {
  const { invalidateByKey } = useQueriesData();

  function handleDeletePreset() {
    deleteTagPreset(name);
    invalidateByKey(['preset']);
  }

  function handleClick() {
    onClick([...tags]);
  }

  return (
    <div className="flex cursor-pointer items-start justify-between rounded-sm bg-card p-2">
      <div className="space-y-1" onClick={handleClick}>
        <span className="font-bold">{name}</span>
        <TagContainer tags={Tags.fromTagGroup(tags)} />
      </div>
      <Button className="p-0" variant="icon" size="icon" onClick={handleDeletePreset}>
        <XIcon />
      </Button>
    </div>
  );
}
