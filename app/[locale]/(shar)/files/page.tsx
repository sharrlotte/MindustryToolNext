'use client';

import React, { useState } from 'react';

import AddFileDialog from '@/app/[locale]/(shar)/files/add-file-dialog';
import DownloadButton from '@/components/button/download-button';
import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import FileCard from '@/components/file/file-card';
import FileHierarchy from '@/components/file/file-hierarchy';
import { Button } from '@/components/ui/button';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { Input } from '@/components/ui/input';
import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useQueryState from '@/hooks/use-query-state';
import { useToast } from '@/hooks/use-toast';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteServerFile, getServerFiles } from '@/query/file';

export default function Page() {
  const [path, setPath] = useQueryState('path', '/');
  const axios = useClientApi();
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
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2 py-2">
      <FileHierarchy path={path} onClick={setFilePath} />
      <div className="flex gap-2">
        <Input
          placeholder="Search file name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <AddFileDialog path={path} />
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
                    onClick={() => deleteFile(`${path}/${file.name}`)}
                  >
                    Delete
                  </ContextMenuItem>
                  <DownloadButton
                    className="justify-start rounded-sm border-none px-2 py-1.5 text-sm hover:bg-brand"
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
