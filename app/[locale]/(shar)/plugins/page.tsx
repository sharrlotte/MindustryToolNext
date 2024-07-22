'use client';

import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';

import InfinitePage from '@/components/common/infinite-page';
import LoadingWrapper from '@/components/common/loading-wrapper';
import PluginCard from '@/components/plugin/plugin-card';
import NameTagSearch from '@/components/search/name-tag-search';
import NameTagSelector from '@/components/search/name-tag-selector';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { usePostTags, useSearchTags } from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import getPlugins from '@/query/plugin/get-plugins';
import postPlugin from '@/query/plugin/post-plugin';
import {
  PostPluginRequest,
  PostPluginRequestData,
  PostPluginRequestSchema,
} from '@/types/request/PostPluginRequest';
import { TagGroups } from '@/types/response/TagGroup';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

export default function Page() {
  const { plugin } = useSearchTags();
  const params = useSearchPageParams();
  const container = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-full flex-col justify-between gap-4 p-4">
      <NameTagSearch tags={plugin} useSort={false} />
      <div
        className="relative flex h-full flex-col overflow-y-auto"
        ref={container}
      >
        <InfinitePage
          className="grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3"
          queryKey={['plugins']}
          getFunc={getPlugins}
          params={params}
          container={() => container.current}
        >
          {(data) => <PluginCard key={data.id} plugin={data} />}
        </InfinitePage>
      </div>
      <div className="flex justify-end">
        <AddPluginButton />
      </div>
    </div>
  );
}

function AddPluginButton() {
  const axios = useClientAPI();
  const { plugin } = usePostTags();
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();

  const t = useI18n();

  const form = useForm<PostPluginRequestData>({
    resolver: zodResolver(PostPluginRequestSchema),
    defaultValues: {
      name: '',
      description: '',
      tags: [],
      url: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PostPluginRequest) => postPlugin(axios, data),
    onSuccess: () => {
      toast({
        title: t('upload.success'),
        variant: 'success',
      });
      invalidateByKey(['plugins']);
      form.reset();
    },
    onError(error) {
      toast({
        title: t('upload.fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  function handleSubmit(value: PostPluginRequestData) {
    const tagString = TagGroups.toStringArray(value.tags);

    mutate({ ...value, tags: tagString });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button title="Add plugin">Add plugin</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex h-full w-full flex-col justify-between gap-2 overflow-y-auto rounded-md p-6">
          <Form {...form}>
            <form
              className="flex flex-1 flex-col justify-between space-y-2"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="flex flex-1 flex-col gap-2 space-y-4 rounded-md p-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plugin name</FormLabel>
                      <FormControl>
                        <Input placeholder="RTV plugin" {...field} />
                      </FormControl>
                      <FormDescription>The plugin name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Some cool stuff" {...field} />
                      </FormControl>
                      <FormDescription>The plugin description</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/sharrlotte/MindustryToolPlugin"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>The plugin url</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <NameTagSelector
                          tags={plugin}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>The plugin tags</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col items-end justify-center rounded-md p-2">
                <Button
                  className="w-fit"
                  variant="primary"
                  type="submit"
                  title={t('upload')}
                  disabled={isPending}
                >
                  <LoadingWrapper isLoading={isPending}>
                    {t('upload')}
                  </LoadingWrapper>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
