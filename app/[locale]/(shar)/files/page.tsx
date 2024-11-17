'use client';

import { ArrowLeftCircleIcon } from 'lucide-react';
import React, { useState } from 'react';

import AddFileDialog from '@/app/[locale]/(shar)/files/add-file-dialog';
import DownloadButton from '@/components/button/download-button';
import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import Tran from '@/components/common/tran';
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
import { deleteServerFile, getServerFiles } from '@/query/file';

import { useMutation, useQuery } from '@tanstack/react-query';

const defaultState = {
  path: '/',
};

export default function Page() {
  const [{ path }, setQueryState] = useQueryState(defaultState);
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
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to delete file',
        description: error.message,
      });
    },
    onSettled: () => {
      invalidateByKey(['server-files', path]);
    },
  });

  function setFilePath(path: string) {
    const newPath = path.replaceAll('//', '/') || '/';

    setQueryState({ path: newPath });
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
        <Input placeholder="Search file name" value={search} onChange={(event) => setSearch(event.target.value)} />
        <AddFileDialog path={path} />
      </div>
      <div className="flex h-full flex-col gap-2 overflow-hidden">
        {path !== '/' && (
          <Button className="items-center justify-start px-2" title=".." onClick={() => setFilePath(path.split('/').slice(0, -1).join('/'))}>
            <ArrowLeftCircleIcon className="w-5"></ArrowLeftCircleIcon>
          </Button>
        )}
        <div className="flex h-full flex-col gap-2 overflow-y-auto">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            data
              .filter(({ name }) => name.includes(search))
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((file) => (
                <FileCard key={file.name} file={file} onClick={(file) => setFilePath(`${path}/${file.name}`)}>
                  <ContextMenuItem variant="destructive" onClick={() => deleteFile(`${path}/${file.name}`)}>
                    <Tran text="delete" />
                  </ContextMenuItem>
                  <DownloadButton
                    className="justify-start rounded-sm border-none px-2 py-1.5 text-sm hover:bg-brand"
                    href={`${env.url.api}/files/download?path=${path}/${file.name}`}
                    fileName={`file.zip`}
                    secure
                  >
                    <Tran text="download" />
                  </DownloadButton>
                </FileCard>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
