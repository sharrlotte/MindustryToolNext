'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Hidden } from '@/components/common/hidden';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { createServerManager } from '@/query/server';
import { CreateServerManagerRequest, CreateServerManagerSchema } from '@/types/request/CreateServerRequest';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

export default function CreateServerManagerDialog() {
  const form = useForm<CreateServerManagerRequest>({
    resolver: zodResolver(CreateServerManagerSchema),
    defaultValues: {
      name: '',
      address: '',
    },
  });

  const [open, setOpen] = useState(false);

  const { invalidateByKey } = useQueriesData();

  const axios = useClientApi();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateServerManagerRequest) => createServerManager(axios, data),
    mutationKey: ['server-manager'],
    onSuccess: () => {
      toast.success(<Tran text="upload.success" />);

      form.reset();
      setOpen(false);
    },
    onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error.message }),

    onSettled: () => {
      invalidateByKey(['server-managers']);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="min-w-20" variant="secondary" title="server.add">
          <Tran text="server-manager.add" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card p-6">
        <Form {...form}>
          <DialogTitle>
            <Tran text="server-manager.add" />
          </DialogTitle>
          <Hidden>
            <DialogDescription />
          </Hidden>
          <form
            className="flex flex-1 flex-col justify-between space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              form.handleSubmit((data) => mutate(data))(event);
            }}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="server-manager.name" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Test" {...field} />
                  </FormControl>
                  <FormDescription>
                    <Tran text="server-manager.name" />
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="server-manager.address" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="my-server-manager.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    <Tran text="server-manager.address-description" />
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="ml-auto grid w-fit grid-cols-2 justify-end gap-2">
              <Button variant="secondary" title="reset" onClick={() => form.reset()}>
                <Tran text="reset" />
              </Button>
              <Button variant="primary" type="submit" title="upload" disabled={isPending}>
                <Tran text="upload" />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
