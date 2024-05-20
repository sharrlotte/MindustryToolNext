'use client';

import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import { Button } from '@/components/ui/button';
import useClientAPI from '@/hooks/use-client';
import useQueryState from '@/hooks/use-query-state';
import useSearchId from '@/hooks/use-search-id-params';
import getInternalServerFiles from '@/query/server/get-internal-server-files';
import { ArrowLeftIcon, FolderIcon } from '@heroicons/react/24/outline';
import { FileIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export default function Page() {
  const [path, setPath] = useQueryState('path', '/');
  const { id } = useSearchId();
  const { axios, enabled } = useClientAPI();
  const { data, isLoading, error } = useQuery({
    queryKey: ['internal-server-files', path],
    queryFn: async () => getInternalServerFiles(axios, id, path),
    enabled,
  });

  if (isLoading || !enabled) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>{error?.message}</div>;
  }

  if (!data) {
    return <NoResult />;
  }

  //TODO: Context menu add/remove file

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      {path !== '/' && (
        <Button
          className="items-center justify-start px-1"
          title=".."
          onClick={() => setPath(path.split('/').slice(0, -1).join('/'))}
        >
          <ArrowLeftIcon className="w-6"></ArrowLeftIcon>
        </Button>
      )}
      {data?.map(({ name, directory }) =>
        directory ? (
          <Button
            className="items-center justify-start gap-1 px-1"
            key={name}
            title={name}
            onClick={() => setPath(path + '/' + name)}
          >
            <FolderIcon className="h-6 w-6" />
            <span>{name}</span>
          </Button>
        ) : (
          <Button
            className="items-center justify-start gap-1 px-1"
            key={name}
            title={name}
            onContextMenu={(event) => {
              event.preventDefault();
              console.log('Hahah');
            }}
          >
            <FileIcon className="h-6 w-6" />
            {name}
          </Button>
        ),
      )}
    </div>
  );
}
