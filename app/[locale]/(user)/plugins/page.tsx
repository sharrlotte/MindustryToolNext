'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import InfinitePage from '@/components/common/infinite-page';
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
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useSearchPageParams from '@/hooks/use-search-page-params';
import { useSearchTags, useUploadTags } from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/client';
import {
  CreatePluginRequest,
  CreatePluginRequestData,
  CreatePluginSchema,
} from '@/types/request/CreatePluginRequest';
import { TagGroups } from '@/types/response/TagGroup';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createPlugin, getPlugins } from '@/query/plugin';
import Tran from '@/components/common/tran';

export default function Page() {
  const { plugin } = useSearchTags();
  const params = useSearchPageParams();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex h-full flex-col justify-between gap-4 p-4">
      <NameTagSearch tags={plugin} useSort={false} />
      <div
        className="relative flex h-full flex-col overflow-y-auto"
        ref={(ref) => setContainer(ref)}
      >
        <InfinitePage
          className="grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3"
          queryKey={['plugins']}
          getFunc={getPlugins}
          params={params}
          container={() => container}
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
  const axios = useClientApi();
  const { plugin } = useUploadTags();
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();

  const t = useI18n();

  const form = useForm<CreatePluginRequestData>({
    resolver: zodResolver(CreatePluginSchema),
    defaultValues: {
      name: '',
      description: '',
      tags: [],
      url: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreatePluginRequest) => createPlugin(axios, data),
    onSuccess: () => {
      toast({
        title: t('upload.success'),
        variant: 'success',
      });
      form.reset();
    },
    onError(error) {
      toast({
        title: t('upload.fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      invalidateByKey(['plugins']);
    },
  });

  function handleSubmit(value: CreatePluginRequestData) {
    const tagString = TagGroups.toStringArray(value.tags);

    mutate({ ...value, tags: tagString });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button title="Add plugin">
          <Tran text="plugin.add" />
        </Button>
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
                      <FormLabel>
                        <Tran text="plugin.name" />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="RTV plugin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Tran text="plugin.description" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Tran text="plugin.url" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/sharrlotte/MindustryToolPlugin"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        <Tran text="plugin.url-description" />
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Tran text="plugin.tags" />
                      </FormLabel>
                      <FormControl>
                        <NameTagSelector
                          tags={plugin}
                          value={field.value}
                          onChange={(fn) => field.onChange(fn(field.value))}
                        />
                      </FormControl>
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
                  {t('upload')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
