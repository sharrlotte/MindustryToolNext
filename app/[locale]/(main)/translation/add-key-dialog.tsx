import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Hidden } from '@/components/common/hidden';
import Tran from '@/components/common/tran';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { clearTranslationCache } from '@/lib/utils';
import { CreateTranslationRequest, CreateTranslationSchema, createTranslation } from '@/query/translation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

export default function AddNewKeyDialog() {
  const form = useForm<CreateTranslationRequest>({
    resolver: zodResolver(CreateTranslationSchema),
    defaultValues: {
      language: 'en',
    },
  });

  const [open, setOpen] = useState(false);

  const { invalidateByKey } = useQueriesData();
  const axios = useClientApi();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateTranslationRequest) => createTranslation(axios, data),
    onSuccess: () => {
      toast.success(<Tran text="upload.success" />);

      form.reset();
      setOpen(false);
    },
    onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error.message }),
    onSettled: () => {
      invalidateByKey(['translations']);
      clearTranslationCache();
    },
  });

  function handleKeyGroupChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;

    if (!value.includes('.')) {
      return form.setValue('keyGroup', value);
    }

    const parts = value.split('.');

    if (parts.length !== 2) {
      return form.setValue('keyGroup', value);
    }

    const keyGroup = parts[0];
    const key = parts[1];

    form.setValue('keyGroup', keyGroup);
    form.setValue('key', key);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10" variant="primary" title="translation add">
          <Tran text="translation.add" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <Hidden>
            <DialogTitle />
            <DialogDescription />
          </Hidden>
          <form className="flex flex-1 flex-col justify-between space-y-4 rounded-md bg-card p-2" onSubmit={form.handleSubmit((value) => mutate(value))}>
            <FormField
              control={form.control}
              name="keyGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="translation.key-group" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Translation" {...field} onChange={handleKeyGroupChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="translation.key" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Some cool stuff" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem className="grid">
                  <FormLabel>
                    <Tran text="translation.value" />
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-1">
              <Button variant="secondary" title="reset" onClick={() => form.reset()}>
                <Tran text="reset" />
              </Button>
              <Button variant="primary" type="submit" title="save" disabled={isPending}>
                <Tran text="save" />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
