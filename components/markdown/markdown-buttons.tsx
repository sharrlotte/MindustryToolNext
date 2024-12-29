import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { BoldIcon, CheckListIcon, CodeBlockIcon, HRIcon, ImageIcon, ItalicIcon, LinkChainIcon, ListIcon, OrderedListIcon, QuoteIcon, StrikethroughIcon, TitleIcon, XIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

import env from '@/constant/env';
import { insertAtCaret, wrapAtCaret } from '@/lib/utils';

import { zodResolver } from '@hookform/resolvers/zod';

type TextArea = {
  value: string;
  selectionStart?: number;
  selectionEnd?: number;
  focus: () => void;
  setSelectionRange: (start: number, end: number) => void;
};

type Props = {
  callback: (fn: (input: TextArea | null, value: string) => string) => void;
};

export function BoldButton({ callback }: Props) {
  return (
    <Button className="h-6 p-0 min-w-0 w-fit" size="icon" title="bold" variant="icon" type="button" onClick={() => callback((input, value) => wrapAtCaret(input, value, '**', '**'))}>
      <BoldIcon className="size-5" />
    </Button>
  );
}
export function ItalicButton({ callback }: Props) {
  return (
    <Button className="h-6 p-0 min-w-0 w-auto" size="icon" title="bold" variant="icon" type="button" onClick={() => callback((input, value) => wrapAtCaret(input, value, '*', '*'))}>
      <ItalicIcon className="size-5" />
    </Button>
  );
}

export function StrikethroughButton({ callback }: Props) {
  return (
    <Button className="h-6" size="icon" title="bold" variant="icon" type="button" onClick={() => callback((input, value) => wrapAtCaret(input, value, '~~', '~~'))}>
      <StrikethroughIcon className="size-5" />
    </Button>
  );
}

export function HRButton({ callback }: Props) {
  return (
    <Button className="h-6" size="icon" title="bold" variant="icon" type="button" onClick={() => callback((input, value) => insertAtCaret(input, value, '\n----------\n'))}>
      <HRIcon className="size-5" />
    </Button>
  );
}

export function TitleButton({ callback }: Props) {
  return (
    <Button className="h-6" size="icon" title="bold" variant="icon" type="button" onClick={() => callback((input, value) => wrapAtCaret(input, value, '# ', ' \n'))}>
      <TitleIcon className="size-5" />
    </Button>
  );
}

export function QuoteButton({ callback }: Props) {
  return (
    <Button className="h-6" size="icon" title="bold" variant="icon" type="button" onClick={() => callback((input, value) => insertAtCaret(input, value, '> '))}>
      <QuoteIcon className="size-5" />
    </Button>
  );
}

export function CodeBlockButton({ callback }: Props) {
  return (
    <Button className="h-6" size="icon" title="bold" variant="icon" type="button" onClick={() => callback((input, value) => wrapAtCaret(input, value, '`', '`'))}>
      <CodeBlockIcon className="size-5" />
    </Button>
  );
}

export function ListButton({ callback }: Props) {
  return (
    <Button className="h-6" size="icon" title="bold" variant="icon" type="button" onClick={() => callback((input, value) => insertAtCaret(input, value, '- '))}>
      <ListIcon className="size-5" />
    </Button>
  );
}

export function OrderedListButton({ callback }: Props) {
  return (
    <Button className="h-6" size="icon" title="bold" variant="icon" type="button" onClick={() => callback((input, value) => insertAtCaret(input, value, '1. '))}>
      <OrderedListIcon className="size-5" />
    </Button>
  );
}

export function CheckListButton({ callback }: Props) {
  return (
    <Button className="h-6" size="icon" title="bold" variant="icon" type="button" onClick={() => callback((input, value) => insertAtCaret(input, value, '- [] '))}>
      <CheckListIcon className="size-5" />
    </Button>
  );
}

type LinkDialogProps = {
  callback: (fn: (input: TextArea | null, value: string) => string) => void;
};

const LinkFormSchema = z.object({
  header: z.string(),
  url: z.string().url(),
});

export function LinkDialog({ callback }: LinkDialogProps) {
  const [open, setOpen] = useState(false);

  function handleAccept({ header, url }: z.infer<typeof LinkFormSchema>) {
    setOpen(false);
    callback((input, value) => insertAtCaret(input, value, `[${header}](${url})`));
    form.reset();
  }

  const form = useForm<z.infer<typeof LinkFormSchema>>({
    resolver: zodResolver(LinkFormSchema),
    defaultValues: {
      header: '',
      url: '',
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-6" size="icon" title="add-link" variant="icon">
          <LinkChainIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-auto p-6"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <DialogTitle>
          <Tran text="add-link" />
        </DialogTitle>
        <Form {...form}>
          <form className="space-y-2" onSubmit={form.handleSubmit(handleAccept)}>
            <FormField
              control={form.control}
              name="header"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="url-header" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="url" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button className="ml-auto" title="submit" type="submit" variant="primary">
                <Tran text="submit" />
              </Button>
            </div>
          </form>
        </Form>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}

const ImageFormSchema = z.object({
  header: z.string(),
  image: z.string().url(),
});

type ImageDialogProps = {
  callback: (fn: (input: TextArea | null, value: string) => { text: string; file: { file?: File; url: string } }) => void;
};

export function ImageDialog({ callback }: ImageDialogProps) {
  const [file, setFile] = useState<File>();
  const [open, setOpen] = useState(false);

  function handleAccept({ header, image }: z.infer<typeof ImageFormSchema>) {
    setOpen(false);

    if (file) {
      callback((input, value) => ({ text: insertAtCaret(input, value, `![${header}](${image})`), file: { file, url: image } }));
    } else {
      callback((input, value) => ({ text: insertAtCaret(input, value, `![${header}](${image})`), file: { url: image } }));
    }

    form.reset();
  }

  const form = useForm<z.infer<typeof ImageFormSchema>>({
    resolver: zodResolver(ImageFormSchema),
    defaultValues: {
      header: '',
      image: '',
    },
  });

  function handleFilePick(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.currentTarget.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    const filename = file.name;
    const extension = filename.split('.').pop();

    if (!extension) {
      toast.error(<Tran text="upload.invalid-image-file" />);
      return;
    }

    if (!env.supportedImageFormat.includes(extension)) {
      toast.error(<Tran text="upload.invalid-image-file" />);
      return;
    }
    const url = URL.createObjectURL(file).replace('blob:', '') + '.' + extension;

    setFile(file);

    form.setValue('image', url);
  }

  const url = form.getValues('image');
  const imageUrl = url && 'blob:' + url.substring(0, url.lastIndexOf('.'));
  const hasImage = URL.canParse(imageUrl);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-6" size="icon" title="add-image" variant="icon">
          <ImageIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="overflow-auto p-6"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <DialogTitle>
          <Tran text="add-image" />
        </DialogTitle>
        <Form {...form}>
          <form className="space-y-2" onSubmit={form.handleSubmit(handleAccept)}>
            <FormField
              control={form.control}
              name="header"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="url-header" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Tran text="image" />
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input {...field} />
                      <label className="flex h-9 items-center justify-center rounded-md border p-2" htmlFor="image" hidden>
                        <ImageIcon className="size-5" />
                      </label>
                      <input id="image" className="w-16" hidden accept=".png, .jpg, .jpeg" type="file" onChange={handleFilePick} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {hasImage && (
              <div className="relative">
                <Button className="absolute right-0 top-0" title="delete" size="icon" variant="icon" onClick={() => form.reset({ image: undefined })}>
                  <XIcon />
                </Button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="preview" />
              </div>
            )}
            <div className="flex justify-end">
              <Button className="ml-auto" title="submit" type="submit" variant="primary">
                <Tran text="submit" />
              </Button>
            </div>
          </form>
        </Form>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
