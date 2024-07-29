import Image from 'next/image';
import React, { HTMLAttributes } from 'react';

import ColorText from '@/components/common/color-text';
import TagContainer from '@/components/tag/tag-container';
import env from '@/constant/env';
import { cn } from '@/lib/utils';
import icon from '@/public/assets/icon.json';
import { Tags } from '@/types/response/Tag';

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
        'overflow-hidden min-w-[40dvw] rounded-lg md:max-w-[min(80dvh,80dvw)]',
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

type TextAndIcon = (string | { link: string } | TextAndIcon)[];

export function DetailDescription({ className, children }: DescriptionProps) {
  const result: ({ link: string } | string)[] = [];
  let text = children;

  function findOne(str: string) {
    for (let i = 0; i < str.length; i++) {
      // Get unicode in hexadecimal
      const key = str.charCodeAt(i);
      // In private use area off .ttf
      if (key <= 63743 && key >= 63092) {
        // Get block name base on icon.properties
        return i;
      }
    }
    return -1;
  }
  let index = -1;
  do {
    index = findOne(text);

    if (index !== -1) {
      const key = text.charCodeAt(index);
      const iconName = (icon as any)[key.toString()].split('|')[1];

      result.push(text.substring(0, index));
      result.push({ link: iconName });

      text = text.substring(index + 1);
    }
  } while (index != -1);

  return (
    <section className={cn('flex flex-wrap gap-0.5', className)}>
      {result.map((item, index) =>
        typeof item === 'string' ? (
          <ColorText className="whitespace-nowrap" key={index} text={item} />
        ) : (
          <Image
            className="size-5"
            key={index}
            width={20}
            height={20}
            src={`${env.url.base}/assets/sprite/${item.link}.png`}
            alt={item.link}
          />
        ),
      )}
    </section>
  );
}
