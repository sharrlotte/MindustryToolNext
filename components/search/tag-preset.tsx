'use client';

import { Hidden } from '@/components/common/hidden';
import Tran from '@/components/common/tran';
import Search from '@/components/search/search-input';
import TagContainer from '@/components/tag/tag-container';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useQueriesData from '@/hooks/use-queries-data';
import { useI18n } from '@/i18n/client';
import { deleteTagPreset, getTagPreset, TagPreset } from '@/lib/utils';
import { Tags } from '@/types/response/Tag';
import TagGroup from '@/types/response/TagGroup';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useMemo, useState } from 'react';

type TagPresetListProps = {
  onPresetChoose: (tags: TagGroup[]) => void;
};

export default function TagPresetList({ onPresetChoose }: TagPresetListProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const t = useI18n();

  const { data } = useQuery({
    queryFn: () => getTagPreset(),
    queryKey: ['preset'],
  });

  const preset = useMemo(
    () => data?.filter((item) => item.name.includes(filter)) || [],
    [filter, data],
  );

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
          <Search.Input
            value={filter}
            placeholder={t('filter')}
            onChange={(event) => setFilter(event.currentTarget.value)}
          />
        </Search>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-2 overflow-y-auto pr-1">
          {preset.map((item) => (
            <TagPresetCard
              key={item.name}
              preset={item}
              onClick={handlePresetChoose}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

type TagPresetCardProps = {
  preset: TagPreset;
  onClick: (tags: TagGroup[]) => void;
};

function TagPresetCard({
  preset: { name, tags },
  onClick,
}: TagPresetCardProps) {
  const { invalidateByKey } = useQueriesData();

  function handleDeletePreset() {
    deleteTagPreset(name);
    invalidateByKey(['preset']);
  }

  return (
    <div className="flex cursor-pointer items-start justify-between rounded-sm bg-card p-2">
      <div className="space-y-1" onClick={() => onClick(tags)}>
        <span className="font-bold">{name}</span>
        <TagContainer tags={Tags.fromTagGroup(tags)} />
      </div>
      <Button
        className="p-0"
        variant="icon"
        size="icon"
        onClick={handleDeletePreset}
      >
        <XMarkIcon className="size-5" />
      </Button>
    </div>
  );
}
