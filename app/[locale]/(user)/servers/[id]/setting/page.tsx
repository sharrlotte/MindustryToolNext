'use client';

import { notFound, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { revalidate } from '@/action/action';
import ColorText from '@/components/common/color-text';
import ComboBox from '@/components/common/combo-box';
import LoadingSpinner from '@/components/common/loading-spinner';
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
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import {
  InternalServerModes,
  PutInternalServerRequest,
  PutInternalServerSchema,
} from '@/types/request/UpdateInternalServerRequest';
import { InternalServerDetail } from '@/types/response/InternalServerDetail';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  deleteInternalServer,
  getInternalServer,
  updateInternalServer,
} from '@/query/server';

type PageProps = {
  params: { id: string };
};

export default function Page({ params: { id } }: PageProps) {
  const axios = useClientAPI();

  const {
    data: server,
    isLoading,
    isError,
    isPending,
    error,
  } = useQuery({
    queryKey: ['servers', id],
    queryFn: () => getInternalServer(axios, { id }),
  });

  if (isLoading || isPending) {
    return <LoadingSpinner />;
  }

  if (error || isError) {
    throw error;
  }

  if (!server) {
    return notFound();
  }

  return <ServerSettingEditor server={server} />;
}

type Props = {
  server: InternalServerDetail;
};

function ServerSettingEditor({ server }: Props) {
  const t = useI18n();
  const router = useRouter();
  const [currentServer, setCurrentServer] = useState(server);
  const form = useForm<PutInternalServerRequest>({
    resolver: zodResolver(PutInternalServerSchema),
    defaultValues: currentServer,
  });
  const { invalidateByKey } = useQueriesData();
  const axios = useClientAPI();
  const { toast } = useToast();

  const { id } = currentServer;

  const { mutate, isPending } = useMutation({
    mutationKey: ['servers'],
    mutationFn: (data: PutInternalServerRequest) =>
      updateInternalServer(axios, id, data),
    onSuccess: (_, data) => {
      invalidateByKey(['servers']);
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
  });

  const { mutate: deleteServer, isPending: isDeleting } = useMutation({
    mutationKey: ['servers'],
    mutationFn: () => deleteInternalServer(axios, id),
    onSuccess: () => {
      invalidateByKey(['servers']);
      toast({
        title: t('delete-success'),
        variant: 'success',
      });
      revalidate('/admin/servers');
      router.push('/admin/servers');
    },
    onError: (error) =>
      toast({
        title: t('delete-fail'),
        description: error.message,
        variant: 'destructive',
      }),
  });

  const isChanged =
    JSON.stringify(form.getValues()) !== JSON.stringify(currentServer);
  const isLoading = isPending || isDeleting;

  return (
    <div className="flex flex-col justify-between gap-2 pl-2">
      <Form {...form}>
        <form
          className="flex flex-1 flex-col justify-between bg-card p-4"
          onSubmit={form.handleSubmit((value) => mutate(value))}
        >
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server name</FormLabel>
                  <FormControl>
                    <Input placeholder="Test" {...field} />
                  </FormControl>
                  <FormDescription>
                    {field.value ? (
                      <ColorText text={field.value} />
                    ) : (
                      'The server name that displayed in game'
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Some cool stuff" {...field} />
                  </FormControl>
                  <FormDescription>
                    {field.value ? (
                      <ColorText text={field.value} />
                    ) : (
                      'The server description that displayed in game'
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
                  <FormLabel>Mode</FormLabel>
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
                  <FormDescription>Server game mode</FormDescription>
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
              disabled={isLoading}
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="min-w-20"
                  title="Delete"
                  variant="destructive"
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                Are you sure you want to delete
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      className="bg-destructive hover:bg-destructive"
                      title={t('delete')}
                      onClick={() => deleteServer()}
                      disabled={isLoading}
                    >
                      {t('delete')}
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </Form>
    </div>
  );
}
