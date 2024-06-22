'use client';

import React, { useState } from 'react';

import AddFileDialog from '@/app/[locale]/shar/file/add-file-dialog';
import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Input } from '@/components/ui/input';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useQueryState from '@/hooks/use-query-state';
import useSearchId from '@/hooks/use-search-id-params';
import { useToast } from '@/hooks/use-toast';
import deleteServerFile from '@/query/files/delete-server-file';
import getServerFiles from '@/query/files/get-server-files';

import { ArrowLeftIcon, FolderIcon } from '@heroicons/react/24/outline';
import { FileIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';

export default function Page() {
  const [path, setPath] = useQueryState('path', '/');
  const { id } = useSearchId();
  const axios = useClientAPI();
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['server-files', path],
    queryFn: async () => getServerFiles(axios, path),
    placeholderData: [],
  });

  const { invalidateByKey } = useQueriesData();

  const { mutate: deleteFile } = useMutation({
    mutationKey: ['delete-file'],
    mutationFn: async (path: string) => deleteServerFile(axios, path),
    onSuccess: () => {
      invalidateByKey(['server-files', path]);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to delete file',
        description: error.message,
      });
    },
  });

  function setFilePath(path: string) {
    setPath(path.replaceAll('//', '/'));
  }

  if (error) {
    return <div>{error?.message}</div>;
  }

  if (!data) {
    return <NoResult />;
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden py-2 p-2">
      <div className="text-base font-bold whitespace-nowrap">
        {[id, ...path.split('/')].filter(Boolean).join(' > ')}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Search file name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <AddFileDialog id={id} path={path} />
      </div>
      <div className="flex h-full flex-col gap-2 overflow-hidden">
        {path !== '/' && (
          <Button
            className="items-center justify-start px-2"
            title=".."
            onClick={() => setFilePath(path.split('/').slice(0, -1).join('/'))}
          >
            <ArrowLeftIcon className="w-5"></ArrowLeftIcon>
          </Button>
        )}
        <div className="flex h-full flex-col gap-2 overflow-y-auto">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            data
              .filter(({ name }) => name.includes(search))
              .map(({ name, directory, data }) =>
                data ? (
                  <p key={name} className="whitespace-pre-line">
                    {data}
                  </p>
                ) : (
                  <ContextMenu key={name}>
                    <ContextMenuTrigger
                      className="flex h-9 cursor-pointer items-center justify-start gap-1 rounded-md border px-1 py-2 text-sm"
                      onClick={() => setFilePath(`${path}/${name}`)}
                    >
                      {directory ? (
                        <FolderIcon className="h-5 w-5" />
                      ) : (
                        <FileIcon className="h-5 w-5" />
                      )}
                      <span>{name}</span>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        variant="destructive"
                        onClick={() => deleteFile(`${path}/${name}`)}
                      >
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ),
              )
          )}
        </div>
      </div>
    </div>
  );
}
