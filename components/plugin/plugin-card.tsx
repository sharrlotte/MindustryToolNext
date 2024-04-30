'use client';

import DeleteButton from '@/components/button/delete-button';
import TagContainer from '@/components/tag/tag-container';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import deletePlugin from '@/query/plugin/delete-plugin';
import { Plugin } from '@/types/response/Plugin';
import { Tags } from '@/types/response/Tag';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

type Props = {
  plugin: Plugin;
};

export default function PluginCard({
  plugin: { id, name, description, tags },
}: Props) {
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();
  const t = useI18n();

  const { axios } = useClientAPI();
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

  return (
    <div>
      <div>{name}</div>
      <div>{description}</div>
      <TagContainer tags={Tags.parseStringArray(tags)} />
      <DeleteButton
        description={`${t('delete')} ${name}`}
        isLoading={isDeleting}
        onClick={() => deletePluginById(id)}
      />
    </div>
  );
}
