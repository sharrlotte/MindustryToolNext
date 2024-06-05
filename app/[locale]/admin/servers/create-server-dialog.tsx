'use client';

import ComboBox from '@/components/common/combo-box';
import { AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { useI18n } from '@/locales/client';
import postInternalServer from '@/query/server/post-internal-server';
import {
  PostInternalServerRequest,
  PostInternalServerSchema,
} from '@/types/request/PostInternalServerRequest';
import { InternalServerModes } from '@/types/request/PutInternalServerRequest';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function CreateServerDialog() {
  const t = useI18n();
  const form = useForm<PostInternalServerRequest>({
    resolver: zodResolver(PostInternalServerSchema),
    defaultValues: {
      name: '',
      description: '',
      mode: 'SURVIVAL',
      port: 6567,
    },
  });

  const { invalidateByKey } = useQueriesData();
  const { axios } = useClientAPI();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ['internal-servers'],
    mutationFn: (data: PostInternalServerRequest) =>
      postInternalServer(axios, data),
    onSuccess: () => {
      invalidateByKey(['internal-servers']);
      toast({
        title: t('upload.success'),
        variant: 'success',
      });
      form.reset();
    },
    onError: (error) =>
      toast({
        title: t('upload.fail'),
        description: error.message,
        variant: 'destructive',
      }),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-end">
          <Button variant="primary" title={t('server.add')}>
            {t('server.add')}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogClose />
        <Form {...form}>
          <form
            className="flex flex-1 flex-col justify-between space-y-4 rounded-md bg-card p-4"
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
                name="discordChannelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
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
            <div className="flex justify-end gap-1">
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
                title={t('upload')}
                disabled={isPending}
              >
                {t('upload')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
