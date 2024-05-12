/* eslint-disable @next/next/no-img-element */
'use client';

import { TagGroups } from '@/types/response/TagGroup';

import { Button } from '@/components/ui/button';
import LoadingWrapper from '@/components/common/loading-wrapper';
import useClientAPI from '@/hooks/use-client';
import { useI18n } from '@/locales/client';
import { useMutation } from '@tanstack/react-query';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import postPlugin from '@/query/plugin/post-plugin';
import {
  PostPluginRequest,
  PostPluginRequestData,
  PostPluginRequestSchema,
} from '@/types/request/PostPluginRequest';
import NameTagSelector from '@/components/search/name-tag-selector';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { usePostTags } from '@/hooks/use-tags';

export default function Page() {
  const { axios } = useClientAPI();
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
    const tagString = TagGroups.toString(value.tags);

    mutate({ ...value, tags: tagString });
  }

  return (
    <div className="flex h-full w-full flex-col justify-between gap-2 overflow-y-auto rounded-md">
      <Form {...form}>
        <form
          className="flex flex-1 flex-col justify-between space-y-2"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="flex flex-1 flex-col gap-2 space-y-4 rounded-md bg-card p-2">
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
          <div className="flex flex-col items-end justify-center rounded-md bg-card p-2">
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
  );
}
