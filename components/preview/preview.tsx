import Image from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

function Preview({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'flex h-full min-h-preview animate-appear flex-col items-center justify-between overflow-hidden rounded-md border shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

function Header({ className, children }: HeaderProps) {
  return (
    <div
      className={cn(
        'flex h-8 overflow-hidden bg-opacity-50 px-2 capitalize',
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

function PImage({ className, src, errorSrc, alt }: ImageProps) {
  return (
    <figure
      className={cn(
        'flex h-full min-h-preview w-full items-center justify-center',
        className,
      )}
    >
      <Image
        className="h-full min-h-preview w-full min-w-preview object-cover"
        src={src}
        alt={alt}
        width={224}
        height={224}
        onError={(err) => (err.currentTarget.src = errorSrc)}
      />
    </figure>
  );
}

type ActionsProps = React.HTMLAttributes<HTMLDivElement>;

function Actions({ className, children }: ActionsProps) {
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

function Description({ className, children }: DescriptionProps) {
  return (
    <section
      className={cn('flex w-full flex-col items-center py-2', className)}
    >
      {children}
    </section>
  );
}

Preview.Header = Header;
Preview.Actions = Actions;
Preview.Image = PImage;
Preview.Description = Description;

export default Preview;
