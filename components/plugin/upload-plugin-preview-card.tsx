'use client';

import { CheckIcon, ExternalLink } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

import DeleteButton from '@/components/button/delete-button';
import TagSelector from '@/components/search/tag-selector';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useUploadTags } from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/i18n/client';
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
import Tran from '@/components/common/tran';
import { Hidden } from '@/components/common/hidden';

type Props = {
  plugin: Plugin;
};

const GITHUBInternalPATTERN =
  /https:\/\/api\.github\.com\/repos\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/.+/;

function InternalUploadPluginCard({ plugin }: Props) {
  const { id, name, description, url, userId } = plugin;
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();
  const t = useI18n();

  const axios = useClientApi();
  const { mutate: deletePluginById, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deletePlugin(axios, id),
    onSuccess: () => {
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
    onSettled: () => {
      invalidateByKey(['plugins']);
    },
  });

  const matches = GITHUBInternalPATTERN.exec(url);
  const user = matches?.at(1);
  const repo = matches?.at(2);

  const githubUrl = `https://github.com/${user}/${repo}`;

  return (
    <div className="minh-28 relative flex flex-col gap-2 rounded-md bg-card p-2">
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

const UploadPluginCard = React.memo(InternalUploadPluginCard);

export default UploadPluginCard;

type DialogProps = {
  plugin: Plugin;
};

function VerifyPluginDialog({ plugin: { id, tags } }: DialogProps) {
  const axios = useClientApi();
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
    onSettled: () => {
      invalidateByKey(['plugins']);
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
          className="flex h-9 w-full items-center justify-center rounded-md border p-0 hover:bg-success"
          variant="outline"
          title="verify"
        >
          <CheckIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Hidden>
          <DialogTitle />
          <DialogDescription />
        </Hidden>
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
                      <FormLabel>
                        <Tran text="plugin.tags" />
                      </FormLabel>
                      <FormControl>
                        <TagSelector
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
              <div className="flex items-end justify-end gap-2 p-2">
                <DialogClose asChild>
                  <Button>
                    <Tran text="cancel" />
                  </Button>
                </DialogClose>
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
