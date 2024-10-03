'use client';

import { Hidden } from '@/components/common/hidden';
import Tran from '@/components/common/tran';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { addTagPreset } from '@/lib/utils';
import TagGroup from '@/types/response/TagGroup';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import TagContainer from '@/components/tag/tag-container';
import { Tags } from '@/types/response/Tag';

type CreatePresetButtonProps = {
  tags: TagGroup[];
};

export default function CreatePresetButton({ tags }: CreatePresetButtonProps) {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(z.object({ name: z.string().min(1).max(100) })),
    defaultValues: {
      name: '',
    },
  });

  const values = useMemo(() => Tags.fromTagGroup(tags), [tags]);

  function createPreset({ name }: { name: string }) {
    addTagPreset({ name, tags: tags || [] });
    setOpen(false);
    toast({
      variant: 'success',
      title: <Tran text="tags.preset-create-success" />,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Tran text="tags.create-preset" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card p-6">
        <Hidden>
          <DialogTitle />
          <DialogDescription />
        </Hidden>
        <Form {...form}>
          <form
            className="relative flex flex-1 flex-col justify-between gap-4 bg-card p-4"
            onSubmit={form.handleSubmit((value) => createPreset(value))}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="tags.preset-name" />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Silicon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TagContainer tags={values} />
            <div className="flex justify-end gap-1">
              <DialogClose asChild>
                <Button variant="secondary" type="submit">
                  <Tran text="close" />
                </Button>
              </DialogClose>
              <Button variant="secondary" type="submit">
                <Tran text="tags.create-preset" />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
