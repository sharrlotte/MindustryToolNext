/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { isValidElement } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import frontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';

import CopyButton from '@/components/button/copy.button';
import { Hidden } from '@/components/common/hidden';
import InternalLink from '@/components/common/internal-link';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import env from '@/constant/env';
import { YOUTUBE_VIDEO_REGEX, cn, extractYouTubeID } from '@/lib/utils';

import { YouTubeEmbed } from '@next/third-parties/google';

type MarkdownProps = {
	className?: string;
	children: string;
};

export const ID_REPlACE_REGEX = /[\s\\/]+/g;
const idMaps: Record<string, number | undefined> = {};

export const shared = {
	idMaps,
};

function toId(children: any): string {
	if (typeof children === 'string' || typeof children === 'number') {
		return String(children);
	}

	if (Array.isArray(children)) {
		return children.map(toId).join('-');
	}

	if (isValidElement(children) && typeof (children.props as any).children === 'string') {
		return (children.props as any).children;
	}

	throw new Error('Cannot extract ID from complex ReactNode on client');
}

const Heading = ({ as: Tag, children, ...props }: { as: any; children: React.ReactNode }) => {
	const id = toId(children).toLowerCase().replaceAll(ID_REPlACE_REGEX, '-');
	const count = shared['idMaps'][id] ?? 0;
	shared['idMaps'][id] = count + 1;

	return (
		<Tag id={id + '-' + count} {...props} className="scroll-mt-20">
			{children}
		</Tag>
	);
};

export const OTHER_WEBSITE_URL_REGEX = /^(https?:)?\/\//;

function A({ href, children }: any) {
	if (href.match(YOUTUBE_VIDEO_REGEX)) {
		const id = extractYouTubeID(href);
		if (id) {
			return <YouTubeEmbed videoid={id} />;
		}
	}

	if (href.startsWith('http') && !href.startsWith(env.url.base)) {
		return (
			<a className="text-emerald-500" href={href} target="_blank" rel="noreferrer">
				{children}
			</a>
		);
	}

	return (
		<InternalLink className="text-brand" href={href}>
			{children}
		</InternalLink>
	);
}

function MarkdownImage({ src, alt }: any) {
	const [isError, setError] = useState(false);

	if (src && src.includes(env.url.base)) {
		src = src && 'blob:' + src.substring(0, src.lastIndexOf('.'));
	}

	src = src.replace('image.mindustry-tool.app', 'image.mindustry-tool.com');

	if (isError) {
		return alt;
	}

	const width = new URL(src).searchParams.get('w') ?? undefined;
	const height = new URL(src).searchParams.get('h') ?? undefined;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<img
					className="markdown-image rounded-md max-h-[50dvh]"
					alt={alt}
					src={src}
					width={width}
					height={height}
					onError={() => setError(true)}
				/>
			</DialogTrigger>
			<DialogContent className="max-w-[100dvw] max-h-dvh sm:max-h-dvh flex justify-center items-center h-full">
				<Hidden>
					<DialogTitle />
					<DialogDescription />
				</Hidden>
				<img alt={alt} src={src} onError={() => setError(true)} />
			</DialogContent>
		</Dialog>
	);
}

const Pre = ({ className, children, ...props }: any) => (
	<pre className={cn('relative group', className)} {...props}>
		{children}
	</pre>
);

const Code = ({ className, children, ...props }: any) => (
	<>
		<code className={cn(className)} {...props}>
			{children}
		</code>
		<CopyButton className="top-1 right-1 absolute" data={children} content={children} variant="ghost" />
	</>
);

export default function Markdown({ className, children }: MarkdownProps) {
	return (
		<ReactMarkdown
			className={cn('markdown space-y-4', className)}
			components={{
				a: A,
				img: MarkdownImage,
				pre: Pre,
				code: Code,
				h1: (props: any) => <Heading as="h1" {...props} />,
				h2: (props: any) => <Heading as="h2" {...props} />,
				h3: (props: any) => <Heading as="h3" {...props} />,
				h4: (props: any) => <Heading as="h4" {...props} />,
				h5: (props: any) => <Heading as="h5" {...props} />,
				h6: (props: any) => <Heading as="h6" {...props} />,
			}}
			rehypePlugins={[rehypeSanitize, rehypeHighlight]}
			remarkPlugins={[[frontmatter, { type: 'yaml', marker: '-' }], remarkGfm]}
		>
			{children}
		</ReactMarkdown>
	);
}
