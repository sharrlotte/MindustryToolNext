import YoutubeEmbed from '@/components/common/youtube-embed';
import env from '@/constant/env';
import { cn } from '@/lib/utils';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

type MarkdownProps = {
  className?: string;
  children: string;
};

const YOUTUBE_VIDEO_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const OTHER_WEBSITE_URL_REGEX = /^(https?:)?\/\//;

function RouterLink({ href, children }: any) {
  if (href.match(YOUTUBE_VIDEO_REGEX)) {
    return <YoutubeEmbed url={href} />;
  }

  return href.match(OTHER_WEBSITE_URL_REGEX) ? (
    <a
      className="text-emerald-500"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  ) : (
    <Link href={href}>{children}</Link>
  );
}

function MarkdownImage({ src, alt }: any) {
  if (src && src.includes(env.url.base)) {
    src = 'blob:' + src;
  }

  return (
    <Image
      className="markdown-image"
      alt={alt}
      src={src}
      width={1024}
      height={800}
      loader={({ src }) => `${src}`}
    />
  );
}

export default function Markdown({ className, children }: MarkdownProps) {
  return (
    <ReactMarkdown
      className={cn('markdown space-y-4', className)}
      components={{ a: RouterLink, img: MarkdownImage }}
      rehypePlugins={[rehypeSanitize]}
    >
      {children}
    </ReactMarkdown>
  );
}
