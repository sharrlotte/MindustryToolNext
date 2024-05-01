'use client';

import getInternalServer from '@/query/server/get-internal-server';
import React from 'react';

import { InternalServerDetail } from '@/types/response/InternalServerDetail';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useI18n } from '@/locales/client';
import { isEqual } from 'lodash';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  InternalServerModes,
  PutInternalServerRequest,
  PutInternalServerSchema,
} from '@/types/request/PutInternalServerRequest';
import putInternalServer from '@/query/server/put-internal-server';
import useClientAPI from '@/hooks/use-client';
import ComboBox from '@/components/common/combo-box';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { notFound } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/common/loading-spinner';

type PageProps = {
  params: { id: string };
};

export default function Page({ params: { id } }: PageProps) {
  const { axios, enabled } = useClientAPI();

  const {
    data: server,
    isLoading,
    isError,
    isPending,
    error,
  } = useQuery({
    queryKey: ['internal-servers', id],
    queryFn: () => getInternalServer(axios, { id }),
    enabled,
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
  const form = useForm<PutInternalServerRequest>({
    resolver: zodResolver(PutInternalServerSchema),
    defaultValues: server,
  });
  const { invalidateByKey } = useQueriesData();
  const { axios } = useClientAPI();
  const { toast } = useToast();

  const { id, started } = server;

  const { mutate, isPending } = useMutation({
    mutationKey: ['internal-servers'],
    mutationFn: (data: PutInternalServerRequest) =>
      putInternalServer(axios, id, data),
    onSuccess: () => {
      invalidateByKey(['internal-servers']);
      server = { ...server, ...form.getValues() };
      toast({
        title: t('update.success'),
        variant: 'success',
      });
    },
    onError: (error) =>
      toast({
        title: t('update.fail'),
        description: error.message,
        variant: 'destructive',
      }),
  });

  const isChanged = !isEqual(form.getValues(), server);

  return (
    <div className="flex flex-col justify-between gap-2">
      <Form {...form}>
        <form
          className="flex flex-1 flex-col justify-between space-y-4 bg-card p-2"
          onSubmit={form.handleSubmit((value) => mutate(value))}
        >
          <div>
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
                    The server name that displayed in game
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
                    The server description that displayed in game
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="6567"
                      type="number"
                      {...field}
                      onChange={(event) =>
                        field.onChange(event.target.valueAsNumber)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    The port that server hosting on
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
                      className="bg-transparent"
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
          <div
            className={cn(
              'flex translate-y-[100vh] justify-end gap-1 transition-transform duration-500',
              {
                'translate-y-0': isChanged,
              },
            )}
          >
            <Button
              variant="secondary"
              title={t('reset')}
              onClick={() => form.reset()}
            >
              {t('reset')}
            </Button>
            <Button
              variant="primary"
              type="submit"
              title={t('update')}
              disabled={isPending}
            >
              {t('update')}
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex justify-end bg-card p-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="min-w-20"
              title="Delete"
              variant="destructive"
              disabled={started}
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
                >
                  {t('delete')}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
