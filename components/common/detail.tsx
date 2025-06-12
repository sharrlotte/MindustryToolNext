import React, { HTMLAttributes, Suspense, useMemo } from 'react';

import AuthorCard from '@/components/common/author-card';
import ColorText from '@/components/common/color-text';
import FallbackImage from '@/components/common/fallback-image';
import MindustryIcon, { parseIconString } from '@/components/common/mindustry-icon';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import TagContainer from '@/components/tag/tag-container';
import IdUserCard from '@/components/user/id-user-card';

import { TagType } from '@/constant/constant';
import { cn } from '@/lib/utils';
import { DetailTagDto } from '@/types/response/Tag';
import { TagGroups } from '@/types/response/TagGroup';

type DetailProps = HTMLAttributes<HTMLDivElement>;

export function Detail({ className, children }: DetailProps) {
	return (
		<ScrollContainer className="absolute inset-0 w-full h-full">
			<div className={cn('flex overflow-hidden relative flex-col gap-6 h-full', className)}>{children}</div>
		</ScrollContainer>
	);
}

type ContentProps = {
	className?: string;
	children: React.ReactNode;
};

export function DetailContent({ className, children }: ContentProps) {
	return (
		<div className={cn('flex overflow-auto relative flex-col h-full lg:grid lg:grid-cols-[1fr_500px] lg:divide-x', className)}>
			{children}
		</div>
	);
}
type InfoProps = React.HTMLAttributes<HTMLDivElement>;

export function DetailInfo({ className, children }: InfoProps) {
	return (
		<div className={cn('flex lg:overflow-y-auto flex-col gap-2 w-full h-full text-sm text-muted-foreground', className)}>
			{children}
		</div>
	);
}

type TitleProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
	children: string;
};

export function DetailTitle({ className, children }: TitleProps) {
	return (
		<h1 className={cn('text-xl capitalize', className)}>
			<ColorText text={children} />
		</h1>
	);
}

type ImageProps = React.HTMLAttributes<HTMLImageElement> & {
	src: string;
	alt: string;
	errorSrc: string;
};

export function DetailImage({ src, errorSrc, alt }: ImageProps) {
	return (
		<div className="flex justify-center p-2 object-contain h-auto lg:overflow-auto lg:max-h-full">
			<figure className="w-full h-full">
				<FallbackImage className="w-full rounded-lg" src={src} alt={alt} errorSrc={errorSrc} loading="eager" />
			</figure>
		</div>
	);
}
type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function DetailHeader({ className, children }: HeaderProps) {
	return <section className={cn('flex flex-col gap-2 p-2 h-full lg:overflow-hidden', className)}>{children}</section>;
}

export function DetailRow({ children }: { children: React.ReactNode }) {
	return <div className="flex gap-1 justify-between items-center">{children}</div>;
}

type ActionsProps = React.HTMLAttributes<HTMLDivElement>;

export function DetailActions({ children }: ActionsProps) {
	return (
		<Suspense>
			<div className="mt-auto flex w-full gap-2 [&>*]:flex-1 border-t pt-2">{children}</div>
		</Suspense>
	);
}

type TagsProps = React.HTMLAttributes<HTMLDivElement> & {
	tags: DetailTagDto[];
	type: TagType;
};

export function DetailTagsCard({ className, tags }: TagsProps) {
	const values = useMemo(() => TagGroups.parsTagDto(tags), [tags]);

	return (
		<Suspense>
			<TagContainer className={className} tagGroups={values} />
		</Suspense>
	);
}

type DescriptionProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
	children?: string;
};

export function DetailDescription({ className, children }: DescriptionProps) {
	const result = parseIconString(children);

	return (
		<p className={cn('flex flex-wrap gap-0.5 text-muted-foreground text-sm', className)}>
			{result.map(({ type, value }, index) =>
				type === 'text' ? <ColorText key={index} text={value} /> : <MindustryIcon key={index} name={value} />,
			)}
		</p>
	);
}

type VerifierProps = {
	verifierId?: string;
};

export function Verifier({ verifierId }: VerifierProps) {
	if (verifierId) {
		return (
			<DetailRow>
				<Tran text="verified-by" />
				<IdUserCard avatar={false} id={verifierId} />
			</DetailRow>
		);
	}
}

type AuthorProps = {
	authorId?: string;
};

export function DetailAuthor({ authorId }: AuthorProps) {
	if (authorId) {
		return <AuthorCard id={authorId} />;
	}
}
