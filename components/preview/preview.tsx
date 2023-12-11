import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Card } from "@/components/ui/card";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

function Preview({ className, children, ...props }: CardProps) {
  return (
    <Card
      className={cn(
        "flex min-h-preview w-preview animate-appear items-center justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

function Header({ className, children }: HeaderProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-preview overflow-hidden bg-opacity-50 px-2 capitalize",
        className,
      )}
    >
      <h2 className="m-auto text-center">{children}</h2>
    </div>
  );
}
type ImageProps = React.HTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

function PImage({ className, src, alt }: ImageProps) {
  return (
    <figure className={cn("h-preview w-preview", className)}>
      <Image
        className="h-full w-full object-cover"
        src={src}
        alt={alt}
        width={576}
        height={576}
        priority
      />
    </figure>
  );
}

type ActionsProps = React.HTMLAttributes<HTMLDivElement>;

function Actions({ className, children }: ActionsProps) {
  return (
    <section
      className={cn("grid grid-flow-col [grid-auto-columns:minmax(0,1fr)] gap-2 w-full justify-center px-2", className)}
    >
      {children}
    </section>
  );
}

type DescriptionProps = React.HTMLAttributes<HTMLDivElement>;

function Description({ className, children }: DescriptionProps) {
  return (
    <section
      className={cn("flex w-full flex-col items-center py-2", className)}
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
