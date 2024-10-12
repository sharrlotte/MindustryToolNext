'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { revalidate } from '@/action/action';
import ColorText from '@/components/common/color-text';
import ComboBox from '@/components/common/combo-box';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/client';
import {
  InternalServerModes,
  PutInternalServerRequest,
  PutInternalServerSchema,
} from '@/types/request/UpdateInternalServerRequest';
import { InternalServerDetail } from '@/types/response/InternalServerDetail';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { deleteInternalServer, updateInternalServer } from '@/query/server';
import Tran from '@/components/common/tran';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  server: InternalServerDetail;
};

export default function ServerUpdateForm({ server }: Props) {
  const t = useI18n();
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
    mutationFn: (data: PutInternalServerRequest) =>
      updateInternalServer(axios, id, data),
    onSuccess: (_, data) => {
      server = { ...currentServer, ...form.getValues() };
      toast({
        title: t('update.success'),
        variant: 'success',
      });
      setCurrentServer((prev) => ({ ...prev, ...data }));
    },
    onError: (error) =>
      toast({
        title: t('update.fail'),
        description: error.message,
        variant: 'destructive',
      }),
    onSettled: () => {
      invalidateByKey(['servers']);
      revalidate({ path: '/servers' });
    },
  });

  const isChanged =
    JSON.stringify(form.getValues()) !== JSON.stringify(currentServer);

  return (
    <div className="relative flex h-full flex-col justify-between gap-2">
      <Form {...form}>
        <form
          className="flex flex-1 flex-col justify-between bg-card p-4"
          onSubmit={form.handleSubmit((value) => mutate(value))}
        >
          <div className="space-y-6 overflow-y-auto p-0.5">
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
                  <FormDescription>
                    {field.value ? (
                      <ColorText text={field.value} />
                    ) : (
                      <Tran text="server.name-description" />
                    )}
                  </FormDescription>
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
                  <FormDescription>
                    {field.value ? (
                      <ColorText text={field.value} />
                    ) : (
                      <Tran text="server.description-description" />
                    )}
                  </FormDescription>
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
          </div>
          <div className="flex justify-end gap-2 p-2">
            <Button
              className={cn(
                'flex translate-y-[100vh] justify-end transition-transform duration-500',
                {
                  'translate-y-0': isChanged,
                },
              )}
              variant="secondary"
              title={t('reset')}
              onClick={() => form.reset()}
              disabled={isPending}
            >
              {t('reset')}
            </Button>
            <Button
              className={cn(
                'flex translate-y-[100vh] justify-end transition-transform duration-500',
                {
                  'translate-y-0': isChanged,
                },
              )}
              variant="primary"
              type="submit"
              title={t('update')}
              disabled={isPending}
            >
              {t('update')}
            </Button>
            <DeleteServerButton id={id} />
          </div>
        </form>
      </Form>
    </div>
  );
}

type DeleteServerButtonProps = {
  id: string;
};

function DeleteServerButton({ id }: DeleteServerButtonProps) {
  const axios = useClientApi();
  const router = useRouter();
  const { invalidateByKey } = useQueriesData();
  const t = useI18n();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationKey: ['servers'],
    mutationFn: () => deleteInternalServer(axios, id),
    onSuccess: () => {
      toast({
        title: t('delete-success'),
        variant: 'success',
      });
      router.push('/servers');
    },
    onError: (error) =>
      toast({
        title: t('delete-fail'),
        description: error.message,
        variant: 'destructive',
      }),
    onSettled: () => {
      revalidate({ path: '/servers' });
      invalidateByKey(['servers']);
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="min-w-20"
          title="Delete"
          variant="destructive"
          disabled={isPending}
        >
          <Tran text="delete" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Tran text="delete-confirm" />
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-destructive hover:bg-destructive"
              title={t('delete')}
              onClick={() => mutate()}
              disabled={isPending}
            >
              {t('delete')}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
