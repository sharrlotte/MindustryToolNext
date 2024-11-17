import { UploadIcon } from 'lucide-react';
import React from 'react';

import Tran from '@/components/common/tran';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  onFileDrop: (files: File[]) => void;
  accept?: string;
};

export default function UploadField({ className, accept, onFileDrop }: Props) {
  function handleDrop(event: React.DragEvent) {
    event.preventDefault();

    const result = [];

    if (event.dataTransfer.items) {
      for (const item of event.dataTransfer.items) {
        const file = item.getAsFile();
        if (file) {
          result.push(file);
        }
      }
    } else {
      for (const file of event.dataTransfer.files) {
        result.push(file);
      }
    }

    if (!isValidFiles(result)) {
      return;
    }

    onFileDrop(result);
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.currentTarget.files) {
      return;
    }

    const files = Array.from(event.currentTarget.files);

    if (!isValidFiles(files)) {
      return;
    }

    onFileDrop(files);
  }

  function isValidFiles(files: File[]) {
    if (accept === undefined) {
      return true;
    }

    const extensions = accept?.split(',');

    return files.every((file) => extensions?.some((extension) => file.name.endsWith(extension)));
  }

  return (
    <div className={cn('flex h-full w-full flex-col items-center justify-center rounded-md border border-border p-10', className)} onDrop={handleDrop} onDragOver={handleDrop}>
      <UploadIcon className="size-10" />
      <span>
        <Tran text="upload.drag-drop-file" />
      </span>
      <span>
        <label className="underline hover:cursor-pointer" htmlFor="file">
          <Tran text="upload.browse-file" />
        </label>
        <input id="file" type="file" hidden accept={accept} onChange={handleFileSelect} />
      </span>
    </div>
  );
}
