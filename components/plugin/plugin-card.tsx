'use client';

import Link from 'next/link';
import React from 'react';
import { toast } from 'sonner';

import DeleteButton from '@/components/button/delete-button';
import Tran from '@/components/common/tran';

import { useSession } from '@/context/session-context.client';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import ProtectedElement from '@/layout/protected-element';
import { deletePlugin } from '@/query/plugin';
import { Plugin } from '@/types/response/Plugin';

import { useMutation } from '@tanstack/react-query';

type Props = {
  plugin: Plugin;
};

const GITHUB_PATTERN = /https:\/\/api\.github\.com\/repos\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/.+/;
export default function PluginCard({ plugin: { id, name, description, url, userId } }: Props) {
  const { invalidateByKey } = useQueriesData();

  const { session } = useSession();

  const axios = useClientApi();
  const { mutate: deletePluginById, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deletePlugin(axios, id),
    onSuccess: () => {
      toast.success(<Tran text="delete-success" />);
    },
    onError: (error) => {
      toast.error(<Tran text="delete-fail" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['plugins']);
    },
  });

  const matches = GITHUB_PATTERN.exec(url);
  const user = matches?.at(1);
  const repo = matches?.at(2);

  const githubUrl = `https://github.com/${user}/${repo}`;

  return (
    <div className="relative flex h-32 flex-col gap-2 overflow-hidden rounded-md bg-card p-4">
      <Link href={githubUrl}>
        <h2 className="line-clamp-1 w-full overflow-hidden text-ellipsis whitespace-normal text-nowrap">{name}</h2>
      </Link>
      <span className="line-clamp-2 h-full w-full overflow-hidden text-ellipsis text-wrap text-muted-foreground">{description}</span>
      <div className="flex gap-2">
        <ProtectedElement session={session} filter={{ authorId: userId }}>
          <DeleteButton className="right-1 top-1 backdrop-brightness-100" variant="ghost" description={<Tran text="delete-alert" args={{ name }} />} isLoading={isDeleting} onClick={() => deletePluginById(id)} />
        </ProtectedElement>
      </div>
    </div>
  );
}
