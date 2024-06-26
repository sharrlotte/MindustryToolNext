import ColorText from '@/components/common/color-text';
import TagContainer from '@/components/tag/tag-container';
import { cn } from '@/lib/utils';
import { Tags } from '@/types/response/Tag';

import Image from 'next/image';
import React, { HTMLAttributes } from 'react';

type DetailProps = HTMLAttributes<HTMLDivElement>;

export function Detail({ className, children }: DetailProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 w-full overflow-y-auto bg-background p-4',
        {},
      )}
    >
      <div
        className={cn(
          'relative flex min-h-full w-full flex-col justify-between gap-2 lg:items-stretch',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
type InfoProps = React.HTMLAttributes<HTMLDivElement>;

export function DetailInfo({ className, children }: InfoProps) {
  return (
    <div className={cn('flex flex-col gap-2 md:flex-row', className)}>
      {children}
    </div>
  );
}

type TitleProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: string;
};

export function DetailTitle({ className, children }: TitleProps) {
  return (
    <h3 className={cn('text-2xl capitalize', className)}>
      <ColorText text={children} />
    </h3>
  );
}

type ImageProps = React.HTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  errorSrc: string;
};

export function DetailImage({ className, src, errorSrc, alt }: ImageProps) {
  return (
    <figure
      className={cn(
        'overflow-hidden rounded-lg md:max-w-[min(80vh,80vw)]',
        className,
      )}
    >
      <Image
        className="h-full w-full object-cover"
        src={src}
        alt={alt}
        width={576}
        height={576}
        priority
        onError={(err) => (err.currentTarget.src = errorSrc)}
      />
    </figure>
  );
}

type ActionsProps = React.HTMLAttributes<HTMLDivElement>;

export function DetailHeader({ className, children }: HeaderProps) {
  return (
    <section className={cn('flex flex-col gap-1', className)}>
      {children}
    </section>
  );
}

type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function DetailActions({ className, children }: ActionsProps) {
  return (
    <section className={cn('flex items-end gap-1', className)}>
      {children}
    </section>
  );
}

type TagsProps = React.HTMLAttributes<HTMLDivElement> & {
  tags: string[];
};

export function DetailTagsCard({ className, tags }: TagsProps) {
  const values = Tags.parseStringArray(tags);

  return <TagContainer className={className} tags={values} />;
}

type DescriptionProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  children: string;
};

export function DetailDescription({ className, children }: DescriptionProps) {
  return (
    <section className={cn('flex flex-col gap-1', className)}>
      <ColorText text={children} />
    </section>
  );
}
