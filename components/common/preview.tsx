import { MotionProps, motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

import FallbackImage from '@/components/common/fallback-image';

import { cn } from '@/lib/utils';

type CardProps = React.HTMLAttributes<HTMLDivElement> & MotionProps;

export function Preview({ className, children, ...props }: CardProps) {
	return (
		<motion.div
			layout
			className={cn(
				'list-none group overflow-hidden relative flex border min-h-preview-height min-w-[min(100vw,var(--preview-size))] bg-card max-w-[calc(var(--preview-size)*1.5)] flex-col rounded-lg shadow-md animate-appear',
				className,
			)}
			{...props}
		>
			{children}
		</motion.div>
	);
}
type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function PreviewHeader({ className, children }: HeaderProps) {
	return <h2 className={cn('p-0 text-xl text-ellipsis text-center', className)}>{children}</h2>;
}

type ImageProps = React.HTMLAttributes<HTMLImageElement> & {
	src: string;
	alt: string;
	errorSrc: string;
} & Parameters<typeof Image>[0];

export function PreviewImage({ className, src, errorSrc, alt, ...props }: ImageProps) {
	return (
		<FallbackImage
			className={cn('aspect-square object-cover w-full rounded-t-md bg-zinc-950', className)}
			loading="eager"
			src={src}
			errorSrc={errorSrc}
			alt={alt}
			width={224}
			height={224}
			priority={props.loading == 'eager' ? true : undefined}
			{...props}
		/>
	);
}

type ActionsProps = React.HTMLAttributes<HTMLDivElement>;

export function PreviewActions({ className, children }: ActionsProps) {
	return (
		<section className={cn('grid w-full grid-flow-col justify-center gap-2 [grid-auto-columns:minmax(0,1fr)]', className)}>
			{children}
		</section>
	);
}

type DescriptionProps = React.HTMLAttributes<HTMLDivElement>;

export function PreviewDescription({ className, children }: DescriptionProps) {
	return <section className={cn('h-28 w-full flex justify-between flex-col p-2', className)}>{children}</section>;
}
