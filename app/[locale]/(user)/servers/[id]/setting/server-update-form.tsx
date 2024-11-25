'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import ColorText from '@/components/common/color-text';
import ComboBox from '@/components/common/combo-box';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { revalidate } from '@/action/action';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { updateInternalServer } from '@/query/server';
import { InternalServerModes, PutInternalServerRequest, PutInternalServerSchema } from '@/types/request/UpdateInternalServerRequest';
import { InternalServerDetail } from '@/types/response/InternalServerDetail';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

type Props = {
  server: InternalServerDetail;
};

export default function ServerUpdateForm({ server }: Props) {
  const [currentServer, setCurrentServer] = useState(server);

  const form = useForm<PutInternalServerRequest>({
    resolver: zodResolver(PutInternalServerSchema),
    defaultValues: {
      ...currentServer,
      startCommand: currentServer.startCommand ?? '',
    },
  });
  const { invalidateByKey } = useQueriesData();
  const axios = useClientApi();
  const { toast } = useToast();

  const { id } = currentServer;

  const { mutate, isPending } = useMutation({
    mutationKey: ['servers'],
    mutationFn: (data: PutInternalServerRequest) => updateInternalServer(axios, id, data),
    onSuccess: (_, data) => {
      server = { ...currentServer, ...form.getValues() };
      toast({
        title: <Tran text="update.success" />,
        variant: 'success',
      });
      setCurrentServer((prev) => ({ ...prev, ...data }));
    },
    onError: (error) =>
      toast({
        title: <Tran text="update.fail" />,
        description: error.message,
        variant: 'destructive',
      }),
    onSettled: () => {
      invalidateByKey(['servers']);
      revalidate({ path: '/servers' });
    },
  });

  const isChanged = JSON.stringify(form.getValues()) !== JSON.stringify(currentServer);

  return (
    <div className="relative flex h-full flex-col justify-between gap-2">
      <Form {...form}>
        <form className="flex flex-1 flex-col justify-between bg-card p-6" onSubmit={form.handleSubmit((value) => mutate(value))}>
          <ScrollContainer className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="server.name" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Test" {...field} />
                  </FormControl>
                  <FormDescription>{field.value ? <ColorText text={field.value} /> : <Tran text="server.name-description" />}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Tran text="server.description" />
                  <FormControl>
                    <Input placeholder="Some cool stuff" {...field} />
                  </FormControl>
                  <FormDescription>{field.value ? <ColorText text={field.value} /> : <Tran text="server.description-description" />}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem className="grid">
                  <FormLabel>
                    <Tran text="server.game-mode" />
                  </FormLabel>
                  <FormControl>
                    <ComboBox
                      searchBar={false}
                      placeholder={InternalServerModes[0]}
                      value={{ label: field.value, value: field.value }}
                      values={InternalServerModes.map((value) => ({
                        label: value,
                        value,
                      }))}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormDescription>
                    <Tran text="server.game-mode-description" />
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startCommand"
              render={({ field }) => (
                <FormItem className="grid">
                  <FormLabel>
                    <Tran text="server.start-command" />
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="host" />
                  </FormControl>
                  <FormDescription>
                    <Tran text="server.start-command-description" />
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </ScrollContainer>
          <div
            className={cn('flex justify-end gap-2 opacity-0', {
              'opacity-100': isChanged,
            })}
          >
            <Button className="flex justify-end" variant="secondary" title="reset" onClick={() => form.reset()} disabled={!isChanged || isPending}>
              <Tran text="reset" />
            </Button>
            <Button className="flex justify-end" variant="primary" type="submit" title="update" disabled={!isChanged || isPending}>
              <Tran text="update" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
