import React from 'react';

import FallbackImage from '@/components/common/fallback-image';
import { cn } from '@/lib/utils';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Preview({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'group relative flex min-h-preview-height min-w-[min(100vw,var(--preview-size))] max-w-[calc(var(--preview-size)*2)] flex-col overflow-hidden rounded-md bg-card/90 shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function PreviewHeader({ className, children }: HeaderProps) {
  return (
    <div className={cn('h-12 overflow-hidden px-2 capitalize', className)}>
      <h4 className="m-auto text-center">{children}</h4>
    </div>
  );
}
type ImageProps = React.HTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  errorSrc: string;
};

export function PreviewImage({ className, src, errorSrc, alt }: ImageProps) {
  return (
    <FallbackImage
      className={cn(
        'aspect-square w-full overflow-hidden object-cover',
        className,
      )}
      src={src}
      errorSrc={errorSrc}
      alt={alt}
      width={224}
      height={224}
    />
  );
}

type ActionsProps = React.HTMLAttributes<HTMLDivElement>;

export function PreviewActions({ className, children }: ActionsProps) {
  return (
    <section
      className={cn(
        'grid w-full grid-flow-col justify-center gap-2 px-2 [grid-auto-columns:minmax(0,1fr)]',
        className,
      )}
    >
      {children}
    </section>
  );
}

type DescriptionProps = React.HTMLAttributes<HTMLDivElement>;

export function PreviewDescription({ className, children }: DescriptionProps) {
  return (
    <section className={cn('h-28 w-full py-2', className)}>{children}</section>
  );
}
