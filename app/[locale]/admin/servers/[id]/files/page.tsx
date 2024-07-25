'use client';

import React, { useState } from 'react';

import AddFileDialog from '@/app/[locale]/admin/servers/[id]/files/add-file-dialog';
import DownloadButton from '@/components/button/download-button';
import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import FileCard from '@/components/file/file-card';
import FileHierarchy from '@/components/file/file-hierarchy';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Input } from '@/components/ui/input';
import env from '@/constant/env';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useQueryState from '@/hooks/use-query-state';
import useSearchId from '@/hooks/use-search-id-params';
import { useToast } from '@/hooks/use-toast';
import deleteServerFile from '@/query/server/delete-internal-server-file';
import getServerFiles from '@/query/server/get-internal-server-files';

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
    queryKey: ['internal-server-files', path],
    queryFn: async () => getServerFiles(axios, id, path),
    placeholderData: [],
  });

  const { invalidateByKey } = useQueriesData();

  const { mutate: deleteFile } = useMutation({
    mutationKey: ['delete-file'],
    mutationFn: async (path: string) => deleteServerFile(axios, id, path),
    onSuccess: () => {
      invalidateByKey(['internal-server-files', path]);
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
      <FileHierarchy path={path} onClick={setFilePath} />
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
              .map((file) => (
                <FileCard
                  key={file.name}
                  file={file}
                  onClick={(file) => setFilePath(`${path}/${file.name}`)}
                >
                  <ContextMenuItem
                    variant="destructive"
                    onClick={() => deleteFile(`${path}/${name}`)}
                  >
                    Delete
                  </ContextMenuItem>
                  <DownloadButton
                    className="border-none justify-start px-2 text-sm py-1.5 hover:bg-brand rounded-sm"
                    href={`${env.url.api}/files/download?path=${path}/${file.name}`}
                    fileName={`file.zip`}
                    secure
                  >
                    Download
                  </DownloadButton>
                </FileCard>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
