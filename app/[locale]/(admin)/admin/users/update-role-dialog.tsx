'use client';

import { revalidate } from '@/action/action';
import { Hidden } from '@/components/common/hidden';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { updateRole, UpdateRoleRequest, UpdateRoleSchema } from '@/query/role';
import { Role } from '@/types/response/Role';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  role: Role;
};

export default function UpdateRoleDialog({ role }: Props) {
  const form = useForm({
    resolver: zodResolver(UpdateRoleSchema),
    defaultValues: role,
  });
  const [open, setOpen] = useState(false);

  const { invalidateByKey } = useQueriesData();
  const axios = useClientApi();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ['roles'],
    mutationFn: (data: UpdateRoleRequest) => updateRole(axios, role.id, data),
    onSuccess: () => {
      toast({
        title: <Tran text="upload.success" />,
        variant: 'success',
      });
      form.reset();
      setOpen(false);
    },
    onError: (error) =>
      toast({
        title: <Tran text="upload.fail" />,
        description: error.message,
        variant: 'destructive',
      }),
    onSettled: () => {
      invalidateByKey(['roles']);
      revalidate({ path: '/users' });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="command">
          <Tran text="role.update-role" />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto p-4">
        <DialogTitle>
          <Tran text="role.update-role" />
        </DialogTitle>
        <Hidden>
          <DialogDescription />
        </Hidden>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit((value) => mutate(value))}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="name" />
                  </FormLabel>
                  <FormControl>
                    <Input className={form.getValues('color')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="description" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="position" />
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="color" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="ml-auto grid w-fit grid-cols-2 justify-end gap-2">
              <Button variant="secondary" onClick={() => form.reset()}>
                <Tran text="reset" />
              </Button>
              <Button variant="primary" type="submit" disabled={isPending}>
                <Tran text="upload" />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
