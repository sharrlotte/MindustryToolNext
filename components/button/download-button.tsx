'use client';

import dynamic from 'next/dynamic';
import { HTMLAttributes, useState } from 'react';

import { DownloadIcon } from '@/components/common/icons';

import { cn } from '@/lib/utils';

const SecureDownloadButton = dynamic(import('@/components/button/secure-download-button'));

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
      className={cn('flex gap-1 px-2 min-h-8 items-center hover:border-transparent transition-colors text-lg justify-center rounded-md bg-secondary border-border border hover:bg-brand hover:text-brand-foreground', className)}
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
