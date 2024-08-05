import React, { HTMLAttributes } from 'react';

import ColorText from '@/components/common/color-text';
import FallbackImage from '@/components/common/fallback-image';
import MindustryIcon, {
  parseIconString,
} from '@/components/common/mindustry-icon';
import TagContainer from '@/components/tag/tag-container';
import { cn } from '@/lib/utils';
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
      <FallbackImage
        className="h-full w-full object-cover"
        src={src}
        alt={alt}
        errorSrc={errorSrc}
        width={576}
        height={576}
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
  const result = parseIconString(children);

  return (
    <section className={cn('flex flex-wrap gap-0.5', className)}>
      {result.map((item, index) =>
        typeof item === 'string' ? (
          <ColorText key={index} text={item} />
        ) : (
          <MindustryIcon key={index} name={item.name} />
        ),
      )}
    </section>
  );
}
