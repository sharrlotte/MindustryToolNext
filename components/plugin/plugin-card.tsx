'use client';

import Link from 'next/link';
import React from 'react';

import DeleteButton from '@/components/button/delete-button';
import TakeDownButton from '@/components/button/take-down-button';
import FallbackImage from '@/components/common/fallback-image';
import Tran from '@/components/common/tran';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { toast } from '@/components/ui/sonner';

import { useSession } from '@/context/session-context';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import ProtectedElement from '@/layout/protected-element';
import { deletePlugin, unverifyPlugin } from '@/query/plugin';
import { Plugin } from '@/types/response/Plugin';

import { useMutation } from '@tanstack/react-query';

type Props = {
  plugin: Plugin;
};

const GITHUB_PATTERN = /https:\/\/api\.github\.com\/repos\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/.+/;
export default function PluginCard({ plugin: { id, name, description, url, userId, isPrivate } }: Props) {
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
  const { mutate: takeDownPluginById, isPending: isTakingDown } = useMutation({
    mutationFn: (id: string) => unverifyPlugin(axios, id),
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
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="relative flex h-32 flex-col gap-2 overflow-hidden rounded-md bg-card p-4">
          <Link href={githubUrl} className="flex gap-1 items-center">
            <FallbackImage
              width={20}
              height={20}
              className="size-5 rounded-sm overflow-hidden"
              src={`https://raw.githubusercontent.com/${user}/${repo}/master/icon.png`}
              errorSrc="https://raw.githubusercontent.com/Anuken/Mindustry/master/core/assets/sprites/error.png"
              alt={''}
            />
            <h2 className="line-clamp-1 w-full overflow-hidden text-ellipsis whitespace-normal text-nowrap">{name}</h2>
          </Link>
          <span className="line-clamp-2 h-full w-full overflow-hidden text-ellipsis text-wrap text-muted-foreground">{description}</span>
          {isPrivate && <span className="top-1 right-1 font-semibold text-sm absolute px-1">PRIVATE</span>}
        </div>
      </ContextMenuTrigger>
      <ProtectedElement session={session} filter={{ any: [{ authorId: userId }, { authority: 'DELETE_PLUGIN' }] }}>
        <ContextMenuContent>
          <ContextMenuItem asChild>
            <TakeDownButton variant="command" description={<Tran text="take-down-alert" args={{ name }} />} isLoading={isTakingDown} onClick={() => takeDownPluginById(id)} />
            <DeleteButton variant="command" description={<Tran text="delete-alert" args={{ name }} />} isLoading={isDeleting} onClick={() => deletePluginById(id)} />
          </ContextMenuItem>
        </ContextMenuContent>
      </ProtectedElement>
    </ContextMenu>
  );
}
