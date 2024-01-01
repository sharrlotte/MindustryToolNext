import { Button } from '@/components/ui/button';
import { fixProgressBar } from '@/lib/utils';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import React, { HTMLAttributes } from 'react';

type DownloadButtonProps = HTMLAttributes<HTMLAnchorElement> & {
  href: string
};

export default function DownloadButton(props: DownloadButtonProps) {
  return (
    <Button
      className="p-2 hover:bg-success"
      title="Download"
      variant="outline"
      asChild
    >
      <a {...props} download onClick={fixProgressBar}>
        <ArrowDownTrayIcon className="h-5 w-5" />
      </a>
    </Button>
  );
}
