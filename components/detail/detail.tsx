import ColorText from '@/components/common/color-text';
import TagCard from '@/components/tag/tag-card';
import { cn } from '@/lib/utils';
import Tag, { Tags } from '@/types/response/Tag';
import Image from 'next/image';
import React, { HTMLAttributes } from 'react';

type DetailProps = HTMLAttributes<HTMLDivElement> & {
  padding?: boolean;
};

function Detail({ className, children, padding }: DetailProps) {
  return (
    <div className="absolute h-full w-full bg-background">
      <div
        className={cn(
          'relative flex h-full w-full flex-col justify-between gap-2 overflow-x-hidden lg:items-stretch',
          className,
          {
            'p-2': padding,
          },
        )}
      >
        {children}
      </div>
    </div>
  );
}
type InfoProps = React.HTMLAttributes<HTMLDivElement>;

function Info({ className, children }: InfoProps) {
  return (
    <div className={cn('flex flex-row flex-wrap gap-2', className)}>
      {children}
    </div>
  );
}

type TitleProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: string;
};

function Title({ className, children }: TitleProps) {
  return (
    <h1 className={cn('text-2xl capitalize', className)}>
      <ColorText text={children} />
    </h1>
  );
}

type ImageProps = React.HTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  errorSrc: string;
};

function PImage({ className, src, errorSrc, alt }: ImageProps) {
  return (
    <figure
      className={cn(
        'overflow-hidden rounded-lg md:max-w-[min(80dvh,80dvw)]',
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

function Header({ className, children }: HeaderProps) {
  return (
    <section className={cn('flex flex-col gap-1', className)}>
      {children}
    </section>
  );
}

type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

function Actions({ className, children }: ActionsProps) {
  return (
    <section className={cn('flex items-center gap-1', className)}>
      {children}
    </section>
  );
}

type TagsProps = React.HTMLAttributes<HTMLDivElement> & {
  tags: string[];
};

function TagsCard({ className, tags }: TagsProps) {
  const values = Tags.parseStringArray(tags);

  return (
    <section className={cn('flex flex-wrap gap-1', className)}>
      {values.map((item) => (
        <TagCard key={item.name + item.value} tag={item} />
      ))}
    </section>
  );
}

type DescriptionProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  children: string;
};

function Description({ className, children }: DescriptionProps) {
  return (
    <section className={cn('flex flex-col gap-1', className)}>
      <ColorText text={children} />
    </section>
  );
}

Detail.Info = Info;
Detail.Header = Header;
Detail.Actions = Actions;
Detail.Image = PImage;
Detail.Title = Title;
Detail.Description = Description;
Detail.Tags = TagsCard;

export default Detail;
