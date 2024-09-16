import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createServerFile } from '@/query/file';
import Tran from '@/components/common/tran';

const addFileSchema = z.object({
  file: z
    .any()
    .refine((files) => files.size <= 500000, `Max file size is 5MB.`),
});

type Props = {
  path: string;
};

export default function AddFileDialog({ path }: Props) {
  const axios = useClientApi();
  const { invalidateByKey } = useQueriesData();

  type AddFileRequest = z.infer<typeof addFileSchema>;

  const [resetFile, setResetFile] = useState(0);

  const form = useForm<AddFileRequest>({
    resolver: zodResolver(addFileSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const { mutate: addFile, isPending: isAddingFile } = useMutation({
    mutationKey: ['add-file'],
    mutationFn: async (file: File) => createServerFile(axios, path, file),
    onSuccess: () => {
      invalidateByKey(['server-files', path]);
    },
  });

  const isPending = isAddingFile;

  function handleSubmit(data: AddFileRequest) {
    addFile(data.file);
    form.reset();
    setResetFile((prev) => prev + 1);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-9 w-fit whitespace-nowrap"
          title="Add file"
          variant="outline"
        >
          <Tran text="upload.add-file" />
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
                  <FormLabel>
                    <Tran text="upload.file-to-upload" />
                  </FormLabel>
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
                  <Tran text="save" />
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
