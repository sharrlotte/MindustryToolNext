import Image from 'next/image';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

import InternalLink from '@/components/common/internal-link';

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
  if (src && src.includes(env.url.base)) {
    src = 'blob:' + src;
  }

  return <Image className="markdown-image" alt={alt} src={src} width={1024} height={800} loader={({ src }) => `${src}`} />;
}

export default function Markdown({ className, children }: MarkdownProps) {
  return (
    <ReactMarkdown className={cn('markdown space-y-4', className)} components={{ a: RouterLink, img: MarkdownImage }} rehypePlugins={[rehypeSanitize]}>
      {children}
    </ReactMarkdown>
  );
}
