import { saveAs } from 'file-saver';
import React, { HTMLAttributes } from 'react';

import useClientAPI from '@/hooks/use-client';
import { cn, fixProgressBar } from '@/lib/utils';

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';

type DownloadButtonProps = HTMLAttributes<HTMLAnchorElement> & {
  href: string;
  fileName?: string;
  secure?: boolean;
};

export default function DownloadButton({
  className,
  href,
  fileName,
  secure,
  children,
  ...props
}: DownloadButtonProps) {
  if (secure) {
    return (
      <SecureDownloadButton
        className={className}
        href={href}
        fileName={fileName}
        {...props}
      >
        {children}
      </SecureDownloadButton>
    );
  }

  return (
    <a
      className={cn(
        'flex min-h-8 items-center justify-center rounded-md border border-border hover:bg-brand',
        className,
      )}
      {...props}
      href={href}
      download={fileName ?? true}
      onClick={fixProgressBar}
    >
      <ArrowDownTrayIcon className="h-5 w-5" />
    </a>
  );
}

type SecureDownloadButtonProps = HTMLAttributes<HTMLAnchorElement> & {
  href: string;
  fileName?: string;
};

function SecureDownloadButton({
  className,
  fileName,
  href,
  children,
}: SecureDownloadButtonProps) {
  const axios = useClientAPI();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axios
        .get(href, { responseType: 'blob' })
        .then(
          (result) =>
            new Blob([result.data], { type: 'application/octet-stream' }),
        )
        .then((blob) => saveAs(blob, fileName ?? 'plugin.zip')),
  });

  return (
    <div
      className={cn(
        'flex min-h-8 hover:bg-brand cursor-pointer items-center justify-center rounded-md border border-border',
        className,
      )}
    >
      {isPending ? (
        <div className="relative flex h-full w-full cursor-pointer items-center justify-center">
          <svg
            className="absolute h-5 w-5 animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path d="M 16.5 12 L 12 16.5 L 16.5 12 Z M 12 16.5 L 7.5 12 L 12 16.5 Z M 12 16.5 L 12 3 L 12 16.5 Z"></path>
          </svg>
          <svg
            className="absolute h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M 3 16.5 L 3 18.75 C 3 19.993 4.007 21 5.25 21 L 18.75 21 C 19.993 21 21 19.993 21 18.75 L 21 16.5"
            />
          </svg>
        </div>
      ) : (
        <div onClick={() => mutate()}>
          {children || <ArrowDownTrayIcon className="h-5 w-5" />}
        </div>
      )}
    </div>
  );
}
