'use client';

import LoadingSpinner from '@/components/common/loading-spinner';
import NoResult from '@/components/common/no-result';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { Input } from '@/components/ui/input';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useQueryState from '@/hooks/use-query-state';
import useSearchId from '@/hooks/use-search-id-params';
import deleteInternalServerFile from '@/query/server/delete-internal-server-file';
import getInternalServerFiles from '@/query/server/get-internal-server-files';
import postInternalServerFile from '@/query/server/post-internal-server-file';
import {
  ArrowLeftIcon,
  FolderIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function Page() {
  const addFileSchema = z.object({
    file: z
      .any()
      .refine((files) => files.size <= 500000, `Max file size is 5MB.`),
  });

  type AddFileRequest = z.infer<typeof addFileSchema>;

  const [resetFile, setResetFile] = useState(0);

  const [path, setPath] = useQueryState('path', '/');
  const { id } = useSearchId();
  const { axios, enabled } = useClientAPI();
  const { invalidateByKey } = useQueriesData();

  const { data, isLoading, error } = useQuery({
    queryKey: ['internal-server-files', path],
    queryFn: async () => getInternalServerFiles(axios, id, path),
    enabled,
  });

  const form = useForm<AddFileRequest>({
    resolver: zodResolver(addFileSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const { mutate: addFile, isPending: isAddingFile } = useMutation({
    mutationKey: ['add-file'],
    mutationFn: async (file: File) =>
      postInternalServerFile(axios, id, path, file),
    onSuccess: () => {
      invalidateByKey(['internal-server-files', path]);
    },
  });

  const { mutate: deleteFile, isPending: isDeletingFile } = useMutation({
    mutationKey: ['delete-file'],
    mutationFn: async (path: string) =>
      deleteInternalServerFile(axios, id, path),
    onSuccess: () => {
      invalidateByKey(['internal-server-files', path]);
    },
  });

  const isPending = isDeletingFile || isAddingFile;

  if (isLoading || !enabled) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>{error?.message}</div>;
  }

  if (!data) {
    return <NoResult />;
  }

  function handleSubmit(data: AddFileRequest) {
    addFile(data.file);
    form.reset();
    setResetFile((prev) => prev + 1);
  }
  //TODO: Context menu add/remove file

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden py-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-fit" title="Add file" variant="primary">
            Add file
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File to upload</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          key={resetFile}
                          id="add-file"
                          name="file"
                          type="file"
                          onChange={(event) => {
                            const files = event.currentTarget.files;
                            if (files && files.length > 0) {
                              field.onChange(files[0]);
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <DialogClose asChild>
                  <Button
                    title="submit"
                    variant="primary"
                    type="submit"
                    disabled={isPending}
                  >
                    Save
                  </Button>
                </DialogClose>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
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
              onClick={() => setPath(`${path}/${name}`)}
            >
              <FolderIcon className="h-6 w-6" />
              <span>{name}</span>
            </Button>
          ) : (
            <ContextMenu key={name}>
              <ContextMenuTrigger className="flex items-center justify-start gap-1 rounded-md border px-1 py-2 h-9">
                <FileIcon className="h-6 w-6" />
                {name}
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => deleteFile(`${path}/${name}`)}>
                  <TrashIcon className="h-6 w-6" />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ),
        )}
      </div>
    </div>
  );
}
