'use client';

import React, { useCallback, useMemo, useState } from 'react';

import Search from '@/components/search/search-input';
import FilterTags from '@/components/tag/filter-tags';
import TagContainer from '@/components/tag/tag-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useI18n } from '@/i18n/client';
import Tag, { Tags } from '@/types/response/Tag';
import TagGroup from '@/types/response/TagGroup';
import { addTagPreset, cn } from '@/lib/utils';
import TagPreset from '@/components/search/tag-preset';
import Tran from '@/components/common/tran';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Hidden } from '@/components/common/hidden';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type NameTagSelectorProps = {
  tags?: TagGroup[];
  disabled?: boolean;
  hideSelectedTag?: boolean;
  value: TagGroup[];
  onChange: (fn: (value: TagGroup[]) => TagGroup[]) => void;
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

  const handleShowFilterDialog = useCallback(
    () => setShowFilterDialog(true),
    [setShowFilterDialog],
  );
  const handleHideFilterDialog = useCallback(
    () => setShowFilterDialog(false),
    [setShowFilterDialog],
  );

  const t = useI18n();

  const handleTagGroupChange = useCallback(
    (name: string, values: string[]) => {
      onChange((value) => {
        const group = value.find((tag) => tag.name === name);
        if (group) {
          group.values = values;

          return value.map((item) =>
            item.name === name ? { ...item, values } : item,
          );
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
        <div className="flex h-screen w-screen items-center justify-center md:h-5/6 md:w-5/6">
          <Card className="flex h-full w-full flex-col justify-between gap-2 rounded-none p-4 md:rounded-lg ">
            <div className="flex w-full gap-2">
              <Search className="w-full p-1">
                <Search.Icon className="p-1" />
                <Search.Input
                  value={filter}
                  placeholder={t('filter')}
                  onChange={(event) => setFilter(event.currentTarget.value)}
                />
              </Search>
              <TagPreset />
            </div>
            <CardContent className="flex h-full w-full flex-col overflow-y-auto overscroll-none p-0 ">
              <FilterTags
                filter={filter}
                filterBy={value}
                tags={tags}
                handleTagGroupChange={handleTagGroupChange}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-1 p-0">
              <CreatePresetButton />
              <Button
                title={t('close')}
                variant="outline"
                onClick={handleHideFilterDialog}
              >
                {t('close')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

type CreatePresetButtonProps = {
  tags?: TagGroup[];
};

function CreatePresetButton({ tags }: CreatePresetButtonProps) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(z.object({ name: z.string().min(1).max(100) })),
    defaultValues: {
      name: '',
    },
  });

  function createPreset({ name }: { name: string }) {
    addTagPreset({ name, tags: tags ?? [] });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Tran text="tags.create-preset" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card p-6">
        <Hidden>
          <DialogTitle />
          <DialogDescription />
        </Hidden>
        <Form {...form}>
          <form
            className="relative flex flex-1 flex-col justify-between gap-4 bg-card p-4"
            onSubmit={form.handleSubmit((value) => createPreset(value))}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="tags.preset-name" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Silicon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button variant="secondary" type="submit">
                <Tran text="tags.create-preset" />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
