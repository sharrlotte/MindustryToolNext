import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';

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
    <Link href={href} scroll={false}>
      {children}
    </Link>
  );
}

function MarkdownImage({ src, alt }: any) {
  return (
    <Image
      className="markdown-image h-full w-full"
      src={src}
      alt={alt}
      width={1024}
      height={800}
    />
  );
}

export default function Markdown({ className, children }: MarkdownProps) {
  return (
    <ReactMarkdown
      className={cn('prose lg:prose-xl', className)}
      components={{ a: RouterLink, img: MarkdownImage }}
    >
      {children}
    </ReactMarkdown>
  );
}
