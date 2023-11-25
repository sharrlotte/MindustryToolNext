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
      <span className="m-auto">{children}</span>
    </div>
  );
}
type ImageProps = React.HTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

function PImage({ className, src, alt }: ImageProps) {
  return (
    <Image
      className={cn("h-preview w-preview", className)}
      src={src}
      alt={alt}
      width={576}
      height={576}
      priority
    />
  );
}

type ActionsProps = React.HTMLAttributes<HTMLDivElement>;

function Actions({ children }: ActionsProps) {
  return (
    <section className="flex w-full items-center justify-around px-1">
      {children}
    </section>
  );
}

type DescriptionProps = React.HTMLAttributes<HTMLDivElement>;

function Description({ children }: DescriptionProps) {
  return (
    <section className="flex w-full flex-col items-center py-2">
      {children}
    </section>
  );
}

Preview.Header = Header;
Preview.Actions = Actions;
Preview.Image = PImage;
Preview.Description = Description;

export default Preview;
