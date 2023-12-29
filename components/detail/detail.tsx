import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { HTMLAttributes } from 'react';

type DetailProps = HTMLAttributes<HTMLDivElement>;

function Detail({ className, children }: DetailProps) {
  return (
    <Card
      className={cn(
        'relative flex h-full w-full flex-1 flex-col justify-between gap-2 overflow-x-hidden rounded-xl border p-2 lg:items-stretch',
        className,
      )}
    >
      {children}
    </Card>
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

type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

function Header({ className, children }: HeaderProps) {
  return <h1 className={cn('text-xl capitalize', className)}>{children}</h1>;
}

type ImageProps = React.HTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  errorSrc: string;
};

function PImage({ className, src, errorSrc, alt }: ImageProps) {
  return (
    <figure
      className={cn('overflow-hidden rounded-lg md:max-w-[min(80vh,80vw)]', className)}
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

function Actions({ className, children }: ActionsProps) {
  return (
    <section className={cn('flex items-center gap-1', className)}>
      {children}
    </section>
  );
}

type DescriptionProps = React.HTMLAttributes<HTMLDivElement>;

function Description({ className, children }: DescriptionProps) {
  return (
    <section className={cn('flex flex-col gap-1', className)}>
      {children}
    </section>
  );
}

Detail.Info = Info;
Detail.Header = Header;
Detail.Actions = Actions;
Detail.Image = PImage;
Detail.Description = Description;

export default Detail;
