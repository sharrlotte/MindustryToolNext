import Image from 'next/image';
import React from 'react';

import FallbackImage from '@/components/common/fallback-image';

import { cn } from '@/lib/utils';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Preview({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('group overflow-hidden relative flex min-h-preview-height min-w-[min(100vw,var(--preview-size))] bg-card/90 max-w-[calc(var(--preview-size)*2)] flex-col rounded-lg shadow-md animate-appear', className)} {...props}>
      {children}
    </div>
  );
}
type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function PreviewHeader({ className, children }: HeaderProps) {
  return <h1 className={cn('h-12 overflow-hidden px-2 text-xl text-center capitalize text-ellipsis w-full', className)}>{children}</h1>;
}

type ImageProps = React.HTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  errorSrc: string;
} & Parameters<typeof Image>[0];

export function PreviewImage({ className, src, errorSrc, alt, ...props }: ImageProps) {
  return <FallbackImage className={cn('aspect-square object-cover w-full rounded-t-lg bg-zinc-950', className)} src={src} errorSrc={errorSrc} alt={alt} width={224} height={224} priority={props.loading == 'eager' ? true : undefined} {...props} />;
}

type ActionsProps = React.HTMLAttributes<HTMLDivElement>;

export function PreviewActions({ className, children }: ActionsProps) {
  return <section className={cn('grid w-full grid-flow-col justify-center gap-2 [grid-auto-columns:minmax(0,1fr)] p-2', className)}>{children}</section>;
}

type DescriptionProps = React.HTMLAttributes<HTMLDivElement>;

export function PreviewDescription({ className, children }: DescriptionProps) {
  return <section className={cn('h-28 w-full flex justify-between flex-col pt-2', className)}>{children}</section>;
}
