'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import ColorText from '@/components/common/color-text';
import ComboBox from '@/components/common/combo-box';
import { Hidden } from '@/components/common/hidden';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';

import { revalidate } from '@/action/action';
import env from '@/constant/env';
import useHttpStream from '@/hooks/use-http-stream';
import useQueriesData from '@/hooks/use-queries-data';
import { CreateInternalServerRequest, CreateInternalServerSchema } from '@/types/request/CreateInternalServerRequest';
import { InternalServerModes } from '@/types/request/UpdateInternalServerRequest';

import { zodResolver } from '@hookform/resolvers/zod';

export default function CreateServerDialog() {
  const form = useForm<CreateInternalServerRequest>({
    resolver: zodResolver(CreateInternalServerSchema),
    defaultValues: {
      name: '',
      description: '',
      mode: 'SURVIVAL',
      startCommand: '',
    },
  });

  const [open, setOpen] = useState(false);

  const { invalidateByKey } = useQueriesData();

  const [visible, setVisible] = useState(false);

  const { data, mutate, isPending, isSuccess } = useHttpStream({
    url: `${env.url.api}/internal-servers`,
    method: 'POST',
    mutationKey: ['internal-servers'],
    body: form.getValues(),
    onMutate: () => setVisible(true),
    onSuccess: () => {
      toast.success(<Tran text="upload.success" />);

      form.reset();
      setOpen(false);
    },
    onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error.message }),

    onSettled: () => {
      invalidateByKey(['servers']);
      revalidate({ path: '/servers' });
    },
  });

  useEffect(() => {
    const containers = document.getElementsByClassName('pagination-container');

    if (containers) {
      for (const container of containers) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [data]);

  function handleVisible(value: boolean) {
    setVisible(value);

    if (isSuccess) {
      revalidate({ path: '/servers' });
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="ml-auto min-w-20" variant="primary" title="server.add">
            <Tran text="server.add" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card p-6">
          <Form {...form}>
            <DialogTitle>
              <Tran text="server.add" />
            </DialogTitle>
            <DialogDescription>
              <Tran text="server.servers-limit" />
            </DialogDescription>
            <form className="flex flex-1 flex-col justify-between space-y-4" onSubmit={form.handleSubmit(() => mutate())}>
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
                    <FormLabel>
                      <Tran text="server.description" />
                    </FormLabel>
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
      <Dialog open={visible} onOpenChange={handleVisible}>
        <DialogContent className="h-full w-full p-6 flex flex-col">
          <DialogTitle>
            <Tran text="server.starting-server" asChild />
          </DialogTitle>
          <Hidden>
            <DialogDescription />
          </Hidden>
          <ScrollContainer className="h-full flex-1 flex w-full flex-col overflow-x-auto">{data?.split('\n').map((text, index) => <ColorText key={index} text={text} />)}</ScrollContainer>
          {isSuccess && (
            <DialogClose className="ml-auto" asChild>
              <Button>
                <Tran text="server.started" />
              </Button>
            </DialogClose>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
