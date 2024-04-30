import { Button } from '@/components/ui/button';
import { cn, fixProgressBar } from '@/lib/utils';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import React, { HTMLAttributes } from 'react';

type DownloadButtonProps = HTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export default function DownloadButton({
  className,
  ...props
}: DownloadButtonProps) {
  return (
    <a
      className="flex min-h-8 items-center justify-center rounded-md border border-border"
      {...props}
      download
      onClick={fixProgressBar}
    >
      <ArrowDownTrayIcon className="h-5 w-5" />
    </a>
  );
}
