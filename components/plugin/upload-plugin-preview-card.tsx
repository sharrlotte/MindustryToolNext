'use client';

import { CheckIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import DeleteButton from '@/components/button/delete-button';
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
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useUploadTags } from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import VerifyPluginRequest, {
  VerifyPluginRequestData,
  VerifyPluginSchema,
} from '@/types/request/VerifyPluginRequest';
import { Plugin } from '@/types/response/Plugin';
import { TagGroups } from '@/types/response/TagGroup';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import verifyPlugin, { deletePlugin } from '@/query/plugin';
import IdUserCard from '@/components/user/id-user-card';

type Props = {
  plugin: Plugin;
};

const GITHUB_PATTERN =
  /https:\/\/api\.github\.com\/repos\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/.+/;
export default function UploadPluginCard({ plugin }: Props) {
  const { id, name, description, url, userId } = plugin;
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();
  const t = useI18n();

  const axios = useClientAPI();
  const { mutate: deletePluginById, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deletePlugin(axios, id),
    onSuccess: () => {
      invalidateByKey(['plugins']);
      toast({
        title: t('delete-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('delete-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const matches = GITHUB_PATTERN.exec(url);
  const user = matches?.at(1);
  const repo = matches?.at(2);

  const githubUrl = `https://github.com/${user}/${repo}`;

  return (
    <div className="relative grid gap-2 rounded-md border p-2">
      <Link className="absolute right-1 top-1 m-1 border-none" href={githubUrl}>
        <ExternalLink className="size-5" />
      </Link>
      <h2>{name}</h2>
      <span>{description}</span>
      <IdUserCard id={userId} />
      <div className="flex gap-2">
        <DeleteButton
          description={`${t('delete')} ${name}`}
          isLoading={isDeleting}
          onClick={() => deletePluginById(id)}
        />
        <VerifyPluginDialog plugin={plugin} />
      </div>
    </div>
  );
}

type DialogProps = {
  plugin: Plugin;
};

function VerifyPluginDialog({ plugin: { id, tags } }: DialogProps) {
  const axios = useClientAPI();
  const { plugin } = useUploadTags();
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();

  const t = useI18n();

  const form = useForm<VerifyPluginRequestData>({
    resolver: zodResolver(VerifyPluginSchema),
    defaultValues: {
      tags: [],
    },
  });

  useEffect(() => {
    form.setValue('tags', TagGroups.parseString(tags, plugin));
  }, [tags, plugin, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: VerifyPluginRequest) => verifyPlugin(axios, data),
    onSuccess: () => {
      invalidateByKey(['plugins']);
      toast({
        title: t('verify-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('verify-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  function handleSubmit(value: VerifyPluginRequestData) {
    const tagString = TagGroups.toStringArray(value.tags);

    mutate({ id, ...value, tags: tagString });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex h-9 w-full p-0"
          variant="outline"
          title="verify"
        >
          <CheckIcon className="size-5" />
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
                  {t('verify')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
