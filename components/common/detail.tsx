import React, { HTMLAttributes, Suspense, useMemo } from 'react';

import ColorText from '@/components/common/color-text';
import ErrorMessage from '@/components/common/error-message';
import FallbackImage from '@/components/common/fallback-image';
import InternalLink from '@/components/common/internal-link';
import MindustryIcon, { parseIconString } from '@/components/common/mindustry-icon';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import TagContainer from '@/components/tag/tag-container';
import BackButton from '@/components/ui/back-button';
import { Skeleton } from '@/components/ui/skeleton';
import ColorAsRole from '@/components/user/color-as-role';
import IdUserCard from '@/components/user/id-user-card';
import UserAvatar from '@/components/user/user-avatar';

import { TagType } from '@/constant/constant';
import useUser from '@/hooks/use-user';
import { cn, findBestRole } from '@/lib/utils';
import { DetailTagDto } from '@/types/response/Tag';
import { TagGroups } from '@/types/response/TagGroup';

type DetailProps = HTMLAttributes<HTMLDivElement>;

export function Detail({ className, children }: DetailProps) {
	return (
		<ScrollContainer className="absolute inset-0 w-full h-full" additionalPadding="pr-4">
			<div className={cn('relative flex flex-col h-full gap-6 overflow-hidden', className)}>{children}</div>
		</ScrollContainer>
	);
}

type ContentProps = {
	className?: string;
	children: React.ReactNode;
};

export function DetailContent({ className, children }: ContentProps) {
	return (
		<div className={cn('relative h-full flex flex-col lg:grid lg:grid-cols-[1fr_400px] lg:divide-x overflow-auto', className)}>
			{children}
		</div>
	);
}
type InfoProps = React.HTMLAttributes<HTMLDivElement>;

export function DetailInfo({ className, children }: InfoProps) {
	return (
		<div className={cn('flex flex-col gap-2 w-full text-muted-foreground text-sm h-full overflow-y-auto', className)}>
			{children}
		</div>
	);
}

type TitleProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
	children: string;
};

export function DetailTitle({ className, children }: TitleProps) {
	return (
		<h1 className={cn('text-xl capitalize border-b', className)}>
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
		<div className="p-2 h-full overflow-auto flex justify-center max-h-[50vh] lg:max-h-full">
			<div className="w-full h-auto">
				<FallbackImage className="w-full rounded-lg" src={src} alt={alt} errorSrc={errorSrc} loading="eager" />
			</div>
		</div>
	);
}
type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function DetailHeader({ className, children }: HeaderProps) {
	return <section className={cn('flex flex-col gap-2 p-2 h-full overflow-hidden', className)}>{children}</section>;
}

export function DetailRow({ children }: { children: React.ReactNode }) {
	return <div className="flex justify-between gap-1 items-center">{children}</div>;
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
			{result.map((item, index) =>
				typeof item === 'string' ? <ColorText key={index} text={item} /> : <MindustryIcon key={index} name={item.name} />,
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
function AuthorCard({ id }: { id: string }) {
	const { data, isLoading, isError, error } = useUser(id);

	if (isLoading) {
		return (
			<div className="flex items-center gap-2 overflow-hidden h-10">
				<Skeleton className="size-8 rounded-full" />
				<div className="space-y-1">
					<Skeleton className="w-32 h-3" />
					<Skeleton className="w-20 h-3" />
				</div>
			</div>
		);
	}

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	if (!data) {
		return;
	}

	const { name, roles } = data;

	return (
		<div className="flex items-center gap-2 overflow-hidden">
			<UserAvatar user={data} url />
			<InternalLink className="cursor-pointer hover:underline flex flex-col gap-0" href={`/users/${data.id}`}>
				<span>{name}</span>
				<ColorAsRole className="font-semibold capitalize" roles={roles}>
					{findBestRole(roles)?.name}
				</ColorAsRole>
			</InternalLink>
		</div>
	);
}
