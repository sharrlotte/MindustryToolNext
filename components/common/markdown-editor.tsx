import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  BoldIcon,
  CheckListIcon,
  CodeBlockIcon,
  EditPanelIcon,
  FullScreenIcon,
  HRIcon,
  ImageIcon,
  ItalicIcon,
  LinkChainIcon,
  ListIcon,
  LivePanelIcon,
  OrderedListIcon,
  PreviewPanelIcon,
  QuoteIcon,
  StrikethroughIcon,
  TitleIcon,
  XIcon,
} from '@/components/common/icons';
import Markdown from '@/components/common/markdown';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';

import { zodResolver } from '@hookform/resolvers/zod';

export type MarkdownData = {
  text: string;
  images: Array<{
    url: string;
    file: File;
  }>;
};

type MarkdownEditorProps = {
  value: MarkdownData;
  onChange: (func: (_value: MarkdownData) => MarkdownData) => void;
};

type EditorMode = 'edit' | 'preview' | 'live';

export default function MarkdownEditor({ value: content, onChange: setContent }: MarkdownEditorProps) {
  const [focused, setFocused] = useState<HTMLElement | null>(null);
  const [mode, setMode] = useState<EditorMode>('live');
  const [isFullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => setFullscreen((prev) => !prev);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  function insertAtCaret(content: string) {
    const input = inputRef.current;

    if (!input) return;

    const position = input.selectionStart ?? input.value.length;

    setContent(({ text, images }) => ({
      text: text.substring(0, position) + content + text.substring(position),
      images,
    }));
    const newPosition = position + content.length;
    input.focus();
    setTimeout(() => input.setSelectionRange(newPosition, newPosition));
  }

  function wrapAtCaret(before: string, after: string) {
    const input = inputRef.current;

    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;

    if (start !== end) {
      setContent(({ text, images }) => ({
        text: text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end),
        images,
      }));

      input.focus();

      setTimeout(() => input.setSelectionRange(start + before.length, end + after.length));
    } else {
      const position = start;

      setContent(({ text, images }) => ({
        text: text.substring(0, position) + before + after + text.substring(position),
        images,
      }));

      let newPosition = position + before.length;
      newPosition = newPosition > 0 ? Math.round(newPosition) : 0;
      input.focus();
      setTimeout(() => input.setSelectionRange(newPosition, newPosition));
    }
  }

  function handleInputScroll() {
    const preview = previewRef.current;
    const input = inputRef.current;

    if (focused !== input) {
      return;
    }

    if (preview && input) {
      const percent = (input.scrollTop + document.body.scrollTop) / (input.scrollHeight - input.clientHeight);

      preview.scrollTop = percent * (preview.scrollHeight - preview.clientHeight) - document.body.scrollTop;
    }
  }

  function handlePreviewScroll() {
    const preview = previewRef.current;
    const input = inputRef.current;

    if (focused !== preview) {
      return;
    }

    if (preview && input) {
      const percent = (preview.scrollTop + document.body.scrollTop) / (preview.scrollHeight - preview.clientHeight);

      input.scrollTop = percent * (input.scrollHeight - input.clientHeight) - document.body.scrollTop;
    }
  }

  return (
    <div
      className={cn('flex h-full w-full flex-col divide-y overflow-hidden rounded-md border bg-background ', {
        'fixed inset-0 z-50 rounded-none': isFullscreen,
      })}
    >
      <section className="flex divide-x">
        <div>
          <Button className="w-5 p-1" size="icon" title="bold" variant="icon" type="button" onClick={() => wrapAtCaret('**', '**')}>
            <BoldIcon className="h-3 w-3" />
          </Button>
          <Button className="w-5 p-1" size="icon" title="italic" variant="icon" onClick={() => wrapAtCaret('*', '*')}>
            <ItalicIcon className="h-3 w-3" />
          </Button>
          <Button className="w-5 p-1" size="icon" title="strikethrough" variant="icon" onClick={() => wrapAtCaret('~~', '~~')}>
            <StrikethroughIcon className="h-3 w-3" />
          </Button>
          <Button className="w-5 p-1" size="icon" title="strikethrough" variant="icon" onClick={() => insertAtCaret('\n----------\n')}>
            <HRIcon className="h-3 w-3" />
          </Button>
          <Button className="p-1" size="icon" title="header" variant="icon" onClick={() => wrapAtCaret('# ', ' \n')}>
            <TitleIcon className="h-3 w-3" />
          </Button>
        </div>
        <div>
          <LinkDialog onAccept={insertAtCaret}>
            <LinkChainIcon className="h-3 w-3" />
          </LinkDialog>
          <Button className="p-1" size="icon" title="quote" variant="icon" onClick={() => insertAtCaret('> ')}>
            <QuoteIcon className="h-3 w-3" />
          </Button>
          <Button className="w-5 p-1" size="icon" title="code-block" variant="icon" onClick={() => wrapAtCaret('`', '`')}>
            <CodeBlockIcon className="h-3 w-3" />
          </Button>
          <ImageDialog
            onAccept={(value, image) => {
              insertAtCaret(value);
              if (image) {
                setContent((prev) => ({
                  ...prev,
                  images: [...prev.images, image],
                }));
              }
            }}
          >
            <ImageIcon className="h-3 w-3" />
          </ImageDialog>
        </div>
        <div>
          <Button className="p-1" size="icon" title="list" variant="icon" onClick={() => insertAtCaret('- ')}>
            <ListIcon className="h-3 w-3" />
          </Button>
          <Button className="p-1" size="icon" title="ordered-list" variant="icon" onClick={() => insertAtCaret('1. ')}>
            <OrderedListIcon className="h-3 w-3" />
          </Button>
          <Button className="p-1" size="icon" title="check-list" variant="icon" onClick={() => insertAtCaret('- [] ')}>
            <CheckListIcon className="h-3 w-3" />
          </Button>
        </div>
        <div className="ml-auto flex divide-x">
          <div>
            <Button className="p-1" size="icon" disabled={mode === 'edit'} title="edit-mode" variant="icon" onClick={() => setMode('edit')}>
              <EditPanelIcon className="h-3 w-3" />
            </Button>
            <Button className="p-1" disabled={mode === 'live'} size="icon" title="live-mode" variant="icon" onClick={() => setMode('live')}>
              <LivePanelIcon className="h-3 w-3" />
            </Button>
            <Button className="p-1" disabled={mode === 'preview'} size="icon" title="preview-mode" variant="icon" onClick={() => setMode('preview')}>
              <PreviewPanelIcon className="h-3 w-3" />
            </Button>
          </div>
          <div className="px-1">
            <Button className="p-1" size="icon" title="fullscreen" variant="icon" onClick={toggleFullscreen}>
              <FullScreenIcon className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </section>
      <div
        className={cn('grid h-full w-full grid-cols-1 divide-y overflow-hidden  md:divide-x md:divide-y-0', {
          'grid-rows-2 md:grid-cols-2 md:grid-rows-1': mode === 'live',
        })}
      >
        {(mode === 'edit' || mode === 'live') && (
          <textarea
            className="h-full w-full resize-none overflow-y-auto border-none bg-transparent p-2 outline-none"
            ref={inputRef}
            title={'content'}
            value={content.text}
            spellCheck="false"
            onScroll={handleInputScroll}
            onMouseEnter={(event) => setFocused(event.currentTarget)}
            onTouchStart={(event) => setFocused(event.currentTarget)}
            onTouchMove={(event) => setFocused(event.currentTarget)}
            onChange={(event) =>
              setContent(({ images }) => ({
                text: event.target.value,
                images,
              }))
            }
          />
        )}
        {(mode === 'preview' || mode === 'live') && (
          <div
            className="h-full w-full overflow-y-auto p-2"
            ref={previewRef}
            onScroll={handlePreviewScroll}
            onMouseEnter={(event) => setFocused(event.currentTarget)}
            onTouchStart={(event) => setFocused(event.currentTarget)}
            onTouchMove={(event) => setFocused(event.currentTarget)}
          >
            <Markdown>{content.text}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}

type LinkDialogProps = {
  children: ReactNode;
  onAccept: (value: string) => void;
};

const LinkFormSchema = z.object({
  header: z.string(),
  url: z.string().url(),
});

function LinkDialog({ children, onAccept }: LinkDialogProps) {
  const [open, setOpen] = useState(false);

  function handleAccept({ header, url }: z.infer<typeof LinkFormSchema>) {
    setOpen(false);
    onAccept(`[${header}](${url})`);
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
        <Button className="w-5 p-1" size="icon" title="add-link" variant="icon">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-auto p-6">
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
  children: ReactNode;
  onAccept: (value: string, image?: { file: File; url: string }) => void;
};

function ImageDialog({ children, onAccept }: ImageDialogProps) {
  const [file, setFile] = useState<File>();
  const [open, setOpen] = useState(false);

  function handleAccept({ header, image }: z.infer<typeof ImageFormSchema>) {
    setOpen(false);

    if (file) {
      onAccept(`![${header}](${image})`, { file, url: image });
    } else {
      onAccept(`![${header}](${image})`);
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
    const url = URL.createObjectURL(file).replace('blob:', '');

    setFile(file);

    form.setValue('image', url);
  }

  const imageUrl = form.getValues('image') && 'blob:' + form.getValues('image');
  const hasImage = URL.canParse(imageUrl);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-5 p-1" size="icon" title="add-image" variant="icon">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-auto p-6">
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
