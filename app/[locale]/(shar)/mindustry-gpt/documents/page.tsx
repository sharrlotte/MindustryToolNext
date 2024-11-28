'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import InfinitePage from '@/components/common/infinite-page';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import DocumentCard from '@/components/document/document-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import useSearchQuery from '@/hooks/use-search-query';
import createDocument, { getDocuments } from '@/query/document';
import { ItemPaginationQuery } from '@/query/search-query';
import { CreateDocumentRequest, CreateDocumentSchema } from '@/types/request/CreateDocumentRequest';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

export default function Page() {
  const params = useSearchQuery(ItemPaginationQuery);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex h-full flex-col justify-between gap-2 p-2">
      <ScrollContainer className="relative flex h-full flex-col" ref={(ref) => setContainer(ref)}>
        <InfinitePage className="grid w-full  gap-2 md:grid-cols-2 lg:grid-cols-3" queryKey={['documents']} queryFn={getDocuments} params={params} container={() => container}>
          {(data) => <DocumentCard key={data.id} document={data} />}
        </InfinitePage>
      </ScrollContainer>
      <div className="flex justify-end">
        <AddDocumentButton />
      </div>
    </div>
  );
}

function AddDocumentButton() {
  const axios = useClientApi();

  const { invalidateByKey } = useQueriesData();

  const form = useForm<CreateDocumentRequest>({
    resolver: zodResolver(CreateDocumentSchema),
    defaultValues: {
      content: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateDocumentRequest) => createDocument(axios, data),
    onSuccess: () => {
      toast.success(<Tran text="upload.success" />);

      form.reset();
    },
    onError(error) {
      toast.error(<Tran text="upload.fail" />, { description: error.message });
    },
    onSettled: () => {
      invalidateByKey(['documents']);
    },
  });

  function handleSubmit(value: CreateDocumentRequest) {
    mutate(value);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button title="Add document" variant="primary">
          <Tran text="document.add" />
        </Button>
      </DialogTrigger>
      <DialogContent asChild>
        <ScrollContainer className="flex h-full w-full flex-col justify-between gap-2 rounded-md">
          <Form {...form}>
            <form className="flex flex-1 flex-col justify-between space-y-2" onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-1 flex-col gap-2 space-y-4 rounded-md p-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Tran text="document.description" />
                      </FormLabel>
                      <FormControl>
                        <Textarea className="min-h-60" placeholder="Some cool stuff" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col items-end justify-center rounded-md p-2">
                <Button className="w-fit" variant="primary" type="submit" title="upload" disabled={isPending}>
                  <Tran text="upload" />
                </Button>
              </div>
            </form>
          </Form>
        </ScrollContainer>
      </DialogContent>
    </Dialog>
  );
}
