import { cn } from '@/lib/utils';

import Image from 'next/image';
import React, { useState } from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Preview({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'flex min-h-preview-height animate-appear flex-col rounded-md border bg-card shadow-md',
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
    <div
      className={cn(
        'h-8 overflow-hidden bg-opacity-50 px-2 capitalize',
        className,
      )}
    >
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
  const [isError, setError] = useState(false);

  return (
    <Image
      className={cn(
        'aspect-square h-full w-full overflow-hidden object-cover',
        className,
      )}
      src={isError ? errorSrc : src}
      alt={alt}
      width={224}
      height={224}
      onError={() => setError(true)}
      priority
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
