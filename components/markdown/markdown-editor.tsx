import React, { useRef, useState } from 'react';

import { EditPanelIcon, FullScreenIcon, LivePanelIcon, PreviewPanelIcon } from '@/components/common/icons';
import Markdown from '@/components/markdown/markdown';
import { BoldButton, CheckListButton, CodeBlockButton, HRButton, ImageDialog, ItalicButton, LinkDialog, ListButton, OrderedListButton, QuoteButton, StrikethroughButton, TitleButton } from '@/components/markdown/markdown-buttons';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

export type MarkdownData = {
  text: string;
  files: Array<{
    url: string;
    file?: File;
  }>;
};

type MarkdownEditorProps = {
  defaultMode?: EditorMode;
  value: MarkdownData;
  onChange: (func: (_value: MarkdownData) => MarkdownData) => void;
};

type EditorMode = 'edit' | 'preview' | 'live';

export default function MarkdownEditor({ value, onChange, defaultMode = 'live' }: MarkdownEditorProps) {
  const [focused, setFocused] = useState<HTMLElement | null>(null);
  const [mode, setMode] = useState<EditorMode>(defaultMode);
  const [isFullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => setFullscreen((prev) => !prev);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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
      className={cn('flex h-full w-full flex-col divide-y overflow-hidden rounded-md border bg-transparent', {
        'fixed inset-0 z-50 rounded-none': isFullscreen,
      })}
    >
      <section className="flex divide-x">
        <div className="flex justify-center items-center p-1 gap-1">
          <BoldButton callback={(fn) => onChange((prev) => ({ files: prev.files, text: fn(inputRef.current, prev.text) }))} />
          <ItalicButton callback={(fn) => onChange((prev) => ({ files: prev.files, text: fn(inputRef.current, prev.text) }))} />
          <StrikethroughButton callback={(fn) => onChange((prev) => ({ files: prev.files, text: fn(inputRef.current, prev.text) }))} />
          <HRButton callback={(fn) => onChange((prev) => ({ files: prev.files, text: fn(inputRef.current, prev.text) }))} />
          <TitleButton callback={(fn) => onChange((prev) => ({ files: prev.files, text: fn(inputRef.current, prev.text) }))} />
        </div>
        <div className="flex justify-center items-center p-1 gap-1">
          <LinkDialog callback={(fn) => onChange((prev) => ({ files: prev.files, text: fn(inputRef.current, prev.text) }))} />
          <QuoteButton callback={(fn) => onChange((prev) => ({ files: prev.files, text: fn(inputRef.current, prev.text) }))} />
          <CodeBlockButton callback={(fn) => onChange((prev) => ({ files: prev.files, text: fn(inputRef.current, prev.text) }))} />
          <ImageDialog
            callback={(fn) =>
              onChange((prev) => {
                const result = fn(inputRef.current, prev.text);

                if (result.file) {
                  return { files: [...prev.files, result.file], text: result.text };
                }

                return { files: prev.files, text: result.text };
              })
            }
          />
        </div>
        <div className="flex justify-center items-center p-1 gap-1">
          <ListButton callback={(fn) => onChange((prev) => ({ files: prev.files, text: fn(inputRef.current, prev.text) }))} />
          <OrderedListButton callback={(fn) => onChange((prev) => ({ files: prev.files, text: fn(inputRef.current, prev.text) }))} />
          <CheckListButton callback={(fn) => onChange((prev) => ({ files: prev.files, text: fn(inputRef.current, prev.text) }))} />
        </div>
        <div className="ml-auto flex divide-x">
          <div className="flex justify-center items-center p-1 gap-1">
            <Button size="icon" disabled={mode === 'edit'} title="edit-mode" variant="icon" onClick={() => setMode('edit')}>
              <EditPanelIcon className="size-5" />
            </Button>
            <Button disabled={mode === 'live'} size="icon" title="live-mode" variant="icon" onClick={() => setMode('live')}>
              <LivePanelIcon className="size-5" />
            </Button>
            <Button disabled={mode === 'preview'} size="icon" title="preview-mode" variant="icon" onClick={() => setMode('preview')}>
              <PreviewPanelIcon className="size-5" />
            </Button>
          </div>
          <div className="px-1 flex justify-center items-center">
            <Button size="icon" title="fullscreen" variant="icon" onClick={toggleFullscreen}>
              <FullScreenIcon className="size-5" />
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
            className="h-full w-full resize-none overflow-y-auto border-transparent bg-transparent p-2 outline-none"
            ref={inputRef}
            title={'content'}
            value={value.text}
            spellCheck="false"
            onScroll={handleInputScroll}
            onMouseEnter={(event) => setFocused(event.currentTarget)}
            onTouchStart={(event) => setFocused(event.currentTarget)}
            onTouchMove={(event) => setFocused(event.currentTarget)}
            onChange={(event) =>
              onChange(({ files }) => ({
                text: event.target.value,
                files,
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
            <Markdown>{value.text}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
