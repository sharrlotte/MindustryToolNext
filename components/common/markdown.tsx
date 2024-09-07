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
}

function RouterLink({ href, children }: any) {
  return href.match(/^(https?:)?\/\//) ? (
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
