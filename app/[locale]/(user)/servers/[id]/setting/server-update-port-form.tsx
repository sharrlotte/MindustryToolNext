'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { revalidate } from '@/action/action';
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
import { useI18n } from '@/i18n/client';
import {
  PutInternalServerPortRequest,
  PutInternalServerPortSchema,
} from '@/types/request/UpdateInternalServerRequest';
import { InternalServerDetail } from '@/types/response/InternalServerDetail';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { updateInternalServerPort } from '@/query/server';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';

type Props = {
  server: InternalServerDetail;
};

export default function ServerUpdatePortForm({ server: { id } }: Props) {
  const t = useI18n();
  const form = useForm<PutInternalServerPortRequest>({
    resolver: zodResolver(PutInternalServerPortSchema),
    defaultValues: {
      port: 0,
    },
  });
  const { invalidateByKey } = useQueriesData();
  const axios = useClientApi();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ['servers'],
    mutationFn: (data: PutInternalServerPortRequest) =>
      updateInternalServerPort(axios, id, data),
    onSuccess: () => {
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
    onSettled: () => {
      invalidateByKey(['servers']);
      revalidate('/servers');
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-1 flex-col justify-between gap-4 bg-card p-4"
        onSubmit={form.handleSubmit((value) => mutate(value))}
      >
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
        </div>
        <div className="flex justify-end">
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
  );
}
