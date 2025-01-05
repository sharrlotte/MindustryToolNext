import React from 'react';

import DownloadButton from '@/components/button/download-button';
import NoResult from '@/components/common/no-result';
import Tran from '@/components/common/tran';
import FileCard from '@/components/file/file-card';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { Skeleton } from '@/components/ui/skeleton';
import Skeletons from '@/components/ui/skeletons';
import { toast } from '@/components/ui/sonner';

import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteServerFile, getServerFiles } from '@/query/server';

import { useMutation, useQuery } from '@tanstack/react-query';

type FileListProps = {
  id: string;
  path: string;
  filter: string;
  setFilePath: (path: string) => void;
};

export default function FileList({ id, path, filter, setFilePath }: FileListProps) {
  const axios = useClientApi();

  const { data, error, isFetching } = useQuery({
    queryKey: ['server-files', id, path],
    queryFn: async () => getServerFiles(axios, id, path),
    placeholderData: [],
  });

  const { invalidateByKey } = useQueriesData();

  const { mutate: deleteFile } = useMutation({
    mutationKey: ['delete-file'],
    mutationFn: async (path: string) => deleteServerFile(axios, id, path),
    onError: (error) => {
      toast.error(<Tran text="delete-fail" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['server', id, 'server-files', path]);
    },
  });

  if (error) {
    return <div>{error?.message}</div>;
  }

  if (isFetching) {
    return (
      <Skeletons number={10}>
        <Skeleton className="h-10 w-full rounded-md" />
      </Skeletons>
    );
  }

  if (!data) {
    return <NoResult />;
  }

  const filteredFiles = data
    .filter(({ name }) => name.includes(filter)) //
    .sort((a, b) => a.name.localeCompare(b.name));

  return filteredFiles.map((file) => (
    <FileCard key={file.name} file={file} onClick={(file) => setFilePath(`${path}/${file.name}`)}>
      <ContextMenuItem variant="destructive" onClick={() => deleteFile(`${path}/${file.name}`)}>
        <Tran text="delete" />
      </ContextMenuItem>
      <DownloadButton className="justify-start rounded-sm border-none px-2 py-1.5 text-sm hover:bg-brand" href={`${env.url.api}/files/download?path=${path}/${file.name}`} fileName={`file.zip`} secure>
        <Tran text="download" />
      </DownloadButton>
    </FileCard>
  ));
}
