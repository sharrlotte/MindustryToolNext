'use client';

import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useForm } from 'react-hook-form';

import { Hidden } from '@/components/common/hidden';
import { EditIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { UpdateTagCategoryRequest, UpdateTagCategorySchema, updateTagCategory } from '@/query/tag';
import { TagCategoryDto } from '@/types/response/TagGroup';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

type Props = {
  category: TagCategoryDto;
};

export default function UpdateTagCategoryDialog({ category }: Props) {
  const form = useForm<UpdateTagCategoryRequest>({
    resolver: zodResolver(UpdateTagCategorySchema),
    defaultValues: category,
  });

  const [open, setOpen] = useState(false);

  const { invalidateByKey } = useQueriesData();

  const axios = useClientApi();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateTagCategoryRequest) => updateTagCategory(axios, category.id, data),
    mutationKey: ['tags'],
    onSuccess: () => {
      toast.success(<Tran text="upload.success" />);

      form.reset();
      setOpen(false);
    },
    onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error.message }),

    onSettled: () => {
      invalidateByKey(['tag-category']);
      invalidateByKey(['tag-detail']);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="min-w-20 p-2" variant="command" title="server.edit">
          <EditIcon />
          <Tran text="tag.edit-category" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card p-6">
        <Form {...form}>
          <DialogTitle>
            <Tran text="tag.edit" />
          </DialogTitle>
          <Hidden>
            <DialogDescription />
          </Hidden>
          <form
            className="flex flex-1 flex-col justify-between space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              form.handleSubmit((data) => mutate(data))(event);
            }}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="tag.name" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Test" {...field} />
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
                  <Dialog>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input {...field} />
                        <DialogTrigger className="aspect-square justify-center items-center flex border rounded-md size-9">
                          <EditIcon />
                        </DialogTrigger>
                      </div>
                    </FormControl>
                    <DialogContent className="p-6">
                      <DialogTitle />
                      <DialogDescription />
                      <HexColorPicker color={field.value} onChange={field.onChange} />
                      <p>{field.value}</p>
                    </DialogContent>
                  </Dialog>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duplicate"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 items-center">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>
                      <Tran text="tags.duplicate" />
                    </FormLabel>
                  </div>
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
  );
}
