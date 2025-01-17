'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Hidden } from '@/components/common/hidden';
import { EditIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { UpdateModRequest, UpdateModSchema, createMod } from '@/query/mod';
import { Mod } from '@/types/response/Mod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

type Props = {
  mod: Mod;
};

export default function UpdateModDialog({ mod }: Props) {
  const form = useForm<UpdateModRequest>({
    resolver: zodResolver(UpdateModSchema),
    defaultValues: mod,
  });

  const [open, setOpen] = useState(false);

  const { invalidateByKey } = useQueriesData();

  const axios = useClientApi();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateModRequest) => createMod(axios, data),
    mutationKey: ['mods'],
    onSuccess: () => {
      toast.success(<Tran text="delete.success" />);

      form.reset();
      setOpen(false);
    },
    onError: (error) => toast.error(<Tran text="delete.fail" />, { description: error.message }),

    onSettled: () => {
      invalidateByKey(['mods']);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="p-2" variant="command" title="server.add">
          <EditIcon />
          <Tran text="edit" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card p-6">
        <Form {...form}>
          <DialogTitle>
            <Tran text="edit" />
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
                    <Tran text="mod.name" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Test" {...field} />
                  </FormControl>
                  <FormDescription>
                    <Tran text="mod.name" />
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
