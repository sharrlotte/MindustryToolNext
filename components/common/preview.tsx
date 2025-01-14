import Image from 'next/image';
import React from 'react';

import FallbackImage from '@/components/common/fallback-image';

import { cn } from '@/lib/utils';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Preview({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('group relative flex min-h-preview-height min-w-[min(100vw,var(--preview-size))] bg-card max-w-[calc(var(--preview-size)*2)] flex-col overflow-hidden rounded-md shadow-md', className)} {...props}>
      {children}
    </div>
  );
}
type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function PreviewHeader({ className, children }: HeaderProps) {
  return <h1 className={cn('h-12 overflow-hidden px-2 text-xl text-center capitalize', className)}>{children}</h1>;
}
type ImageProps = React.HTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  errorSrc: string;
} & Parameters<typeof Image>[0];

export function PreviewImage({ className, src, errorSrc, alt, ...props }: ImageProps) {
  return <FallbackImage className={cn('aspect-square object-cover w-full bg-card', className)} src={src} errorSrc={errorSrc} alt={alt} width={224} height={224} priority={props.loading == 'eager' ? true : undefined} {...props} />;
}

type ActionsProps = React.HTMLAttributes<HTMLDivElement>;

export function PreviewActions({ className, children }: ActionsProps) {
  return <section className={cn('grid w-full grid-flow-col justify-center gap-2 p-2 [grid-auto-columns:minmax(0,1fr)]', className)}>{children}</section>;
}

type DescriptionProps = React.HTMLAttributes<HTMLDivElement>;

export function PreviewDescription({ className, children }: DescriptionProps) {
  return <section className={cn('h-28 w-full py-2', className)}>{children}</section>;
}
