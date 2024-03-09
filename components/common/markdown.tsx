import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownProps {
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
  if (src && src.includes('localhost')) {
    src = 'blob:' + src;
  }

  return (
    <img
      className="markdown-image h-full w-full"
      alt={alt}
      src={src}
      width={1024}
      height={800}
    />
  );
}

export default function Markdown({ className, children }: MarkdownProps) {
  return (
    <ReactMarkdown
      className={cn('markdown', className)}
      components={{ a: RouterLink, img: MarkdownImage }}
      rehypePlugins={[rehypeSanitize]}
    >
      {children}
    </ReactMarkdown>
  );
}
