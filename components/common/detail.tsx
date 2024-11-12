import React, { HTMLAttributes } from 'react';

import ColorText from '@/components/common/color-text';
import FallbackImage from '@/components/common/fallback-image';
import MindustryIcon, {
  parseIconString,
} from '@/components/common/mindustry-icon';
import TagContainer from '@/components/tag/tag-container';
import { cn } from '@/lib/utils';
import { Tags } from '@/types/response/Tag';
import Tran from '@/components/common/tran';
import IdUserCard from '@/components/user/id-user-card';
import BackButton from '@/components/ui/back-button';

type DetailProps = HTMLAttributes<HTMLDivElement>;

export function Detail({ className, children }: DetailProps) {
  return (
    <div className="absolute inset-0 w-full overflow-y-auto bg-background p-2">
      <div
        className={cn(
          'relative flex min-h-full w-full flex-col justify-between gap-2 overflow-y-auto lg:items-stretch',
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
    <div
      className={cn(
        'relative flex flex-col items-start gap-2 md:flex-row',
        className,
      )}
    >
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

export function DetailImage({ src, errorSrc, alt }: ImageProps) {
  return (
    <FallbackImage
      className="w-full min-w-[30dvw] overflow-hidden rounded-lg object-cover md:max-w-[min(min(80dvh,80dvw),1920px)]"
      src={src}
      alt={alt}
      errorSrc={errorSrc}
      width={576}
      height={576}
    />
  );
}
type HeaderProps = React.HTMLAttributes<HTMLDivElement>;
export function DetailHeader({ className, children }: HeaderProps) {
  return (
    <section className={cn('flex flex-col gap-1', className)}>
      {children}
    </section>
  );
}

type ActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  back?: boolean;
};
export function DetailActions({
  className,
  children,
  back = true,
}: ActionsProps) {
  return (
    <section className={cn('flex items-end justify-between gap-1', className)}>
      <div className="grid w-full grid-cols-[repeat(auto-fit,3rem)] gap-2">
        {children}
      </div>
      {back && <BackButton />}
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
    <section className={cn('flex flex-wrap gap-0.5 max-w-[75ch]', className)}>
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

type VerifierProps = {
  verifierId?: string;
};

export function Verifier({ verifierId }: VerifierProps) {
  if (verifierId) {
    return (
      <div className="flex items-end gap-2">
        <Tran text="verified-by" />
        <IdUserCard id={verifierId} />
      </div>
    );
  }
}
