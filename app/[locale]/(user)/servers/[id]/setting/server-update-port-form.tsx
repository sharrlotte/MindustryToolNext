'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';

import { revalidate } from '@/action/action';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { cn } from '@/lib/utils';
import { updateServerPort } from '@/query/server';
import { PutServerPortRequest, PutServerPortSchema } from '@/types/request/UpdateServerRequest';
import { ServerDetail } from '@/types/response/ServerDetail';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

type Props = {
  server: ServerDetail;
};

export default function ServerUpdatePortForm({ server: { id, port, official, autoTurnOff, hub } }: Props) {
  const form = useForm<PutServerPortRequest>({
    resolver: zodResolver(PutServerPortSchema),
    defaultValues: {
      port,
      official,
      autoTurnOff,
      hub,
    },
  });
  const { invalidateByKey } = useQueriesData();
  const axios = useClientApi();

  const { mutate, isPending } = useMutation({
    mutationKey: ['servers'],
    mutationFn: (data: PutServerPortRequest) => updateServerPort(axios, id, data),
    onSuccess: () => {
      revalidate({ path: '/servers' });
      toast.success(<Tran text="update.success" />);
    },
    onError: (error) => toast.error(<Tran text="update.fail" />, { description: error.message }),
    onSettled: () => {
      invalidateByKey(['servers']);
      revalidate({ path: '/servers' });
    },
  });

  const isChanged = form.formState.isDirty;

  return (
    <Form {...form}>
      <form className="relative flex flex-1 flex-col justify-between gap-4 bg-card p-4" onSubmit={form.handleSubmit((value) => mutate(value))}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Tran text="server.port" />
                </FormLabel>
                <FormControl>
                  <Input placeholder="6568" {...field} />
                </FormControl>
                <FormDescription>
                  <Tran text="server.port-description" />
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="official"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-1">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={(value) => field.onChange(value)} />
                  </FormControl>
                  <FormLabel>
                    <Tran text="server.is-official" />
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hub"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-1">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={(value) => field.onChange(value)} />
                  </FormControl>
                  <FormLabel>
                    <Tran text="server.is-hub" />
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="autoTurnOff"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-1">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={(value) => field.onChange(value)} />
                  </FormControl>
                  <FormLabel>
                    <Tran text="server.is-auto-turn-off" />
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div
          className={cn('flex justify-end gap-2 opacity-0 translate-y-full transition-all', {
            'opacity-100 translate-y-0': isChanged,
          })}
        >
          <Button className="flex justify-end" variant="secondary" title="reset" onClick={() => form.reset()} disabled={!isChanged || isPending}>
            <Tran text="reset" />
          </Button>
          <Button variant="primary" type="submit" title="update" disabled={!isChanged || isPending}>
            <Tran text="update" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
