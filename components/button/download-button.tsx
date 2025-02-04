'use client';

import { saveAs } from 'file-saver';
import { HTMLAttributes, useState } from 'react';

import { DownloadIcon } from '@/components/common/icons';

import useClientApi from '@/hooks/use-client';
import { cn } from '@/lib/utils';

import { useMutation } from '@tanstack/react-query';

type DownloadButtonProps = HTMLAttributes<HTMLAnchorElement> & {
  href: string;
  fileName?: string;
  secure?: boolean;
  count?: number;
};

export default function DownloadButton({ className, href, fileName, secure, children, count: initialCount, ...props }: DownloadButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [downloaded, setDownloaded] = useState(false);

  if (secure) {
    return (
      <SecureDownloadButton className={className} href={href} fileName={fileName} {...props}>
        {children}
      </SecureDownloadButton>
    );
  }

  return (
    <a
      className={cn('flex gap-1 px-2 min-h-8 items-center hover:border-none transition-colors text-lg justify-center rounded-md bg-secondary border-border border hover:bg-brand hover:text-brand-foreground', className)}
      {...props}
      href={href}
      download={fileName ?? true}
      title="download"
      onClick={() => {
        setCount((prev) => (prev !== undefined ? (downloaded ? prev : prev + 1) : undefined));
        setDownloaded(true);
      }}
    >
      <DownloadIcon />
      {count}
    </a>
  );
}

type SecureDownloadButtonProps = HTMLAttributes<HTMLAnchorElement> & {
  href: string;
  fileName?: string;
};

function SecureDownloadButton({ className, fileName, href, children }: SecureDownloadButtonProps) {
  const axios = useClientApi();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axios
        .get(href, { responseType: 'blob' })
        .then((result) => new Blob([result.data], { type: 'text/plain;charset=utf-8;' }))
        .then((blob) => saveAs(blob, fileName ?? 'file.zip')),
  });

  return (
    <div className={cn('flex min-h-8 cursor-pointer items-center justify-center rounded-md border border-border hover:bg-brand', className)}>
      {isPending ? (
        <div className="relative flex h-full w-full cursor-pointer items-center justify-center">
          <svg className="absolute size-5 animate-bounce" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path d="M 16.5 12 L 12 16.5 L 16.5 12 Z M 12 16.5 L 7.5 12 L 12 16.5 Z M 12 16.5 L 12 3 L 12 16.5 Z"></path>
          </svg>
          <svg className="absolute size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M 3 16.5 L 3 18.75 C 3 19.993 4.007 21 5.25 21 L 18.75 21 C 19.993 21 21 19.993 21 18.75 L 21 16.5" />
          </svg>
        </div>
      ) : (
        <div onClick={() => mutate()}>{children || <DownloadIcon />}</div>
      )}
    </div>
  );
}
