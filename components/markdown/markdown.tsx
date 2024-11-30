/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

import { Hidden } from '@/components/common/hidden';
import InternalLink from '@/components/common/internal-link';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import env from '@/constant/env';
import { YOUTUBE_VIDEO_REGEX, cn, extractYouTubeID } from '@/lib/utils';

import { YouTubeEmbed } from '@next/third-parties/google';

type MarkdownProps = {
  className?: string;
  children: string;
};

export const OTHER_WEBSITE_URL_REGEX = /^(https?:)?\/\//;

function RouterLink({ href, children }: any) {
  if (href.match(YOUTUBE_VIDEO_REGEX)) {
    const id = extractYouTubeID(href);
    if (id) {
      return <YouTubeEmbed videoid={id} />;
    }
  }

  return href.match(OTHER_WEBSITE_URL_REGEX) ? (
    <a className="text-emerald-500" href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    <InternalLink href={href}>{children}</InternalLink>
  );
}

function MarkdownImage({ src, alt }: any) {
  const [isError, setError] = useState(false);

  if (src && src.includes(env.url.base)) {
    src = 'blob:' + src;
  }

  if (isError) {
    return alt;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <img className="markdown-image rounded-md max-h-[50dvh]" alt={alt} src={src} onError={() => setError(true)} />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[100dvw] max-h-dvh sm:max-h-dvh flex justify-center items-center h-full">
        <Hidden>
          <DialogTitle />
          <DialogDescription />
        </Hidden>
        <img alt={alt} src={src} onError={() => setError(true)} />
      </DialogContent>
    </Dialog>
  );
}

export default function Markdown({ className, children }: MarkdownProps) {
  return (
    <ReactMarkdown className={cn('markdown space-y-4', className)} components={{ a: RouterLink, img: MarkdownImage }} rehypePlugins={[rehypeSanitize]}>
      {children}
    </ReactMarkdown>
  );
}
