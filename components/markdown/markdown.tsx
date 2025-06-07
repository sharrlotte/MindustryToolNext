import { isValidElement } from 'react';
import React from 'react';
import ReactMarkdown, { Options } from 'react-markdown';
import { jsx, jsxs } from 'react/jsx-runtime';
import rehypeHighlight from 'rehype-highlight';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import rehypeRemark from 'rehype-remark';
import rehypeSanitize from 'rehype-sanitize';
import frontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

import CopyButton from '@/components/button/copy.button';
import InternalLink from '@/components/common/internal-link';
import MarkdownImage from '@/components/markdown/markdown-image';

import env from '@/constant/env';
import { YOUTUBE_VIDEO_REGEX, cn, extractYouTubeID } from '@/lib/utils';

import { YouTubeEmbed } from '@next/third-parties/google';

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

	if (isValidElement(children) && typeof (children?.props as any)?.children) {
		return toId((children.props as any).children);
	}

	throw new Error('Cannot extract ID from complex ReactNode on client');
}

const Heading = ({ as: Tag, children, ...props }: { as: any; children: React.ReactNode }) => {
	try {
		const id = toId(children).toLowerCase().replaceAll(ID_REPlACE_REGEX, '-');

		const count = shared['idMaps'][id] ?? 0;
		shared['idMaps'][id] = count + 1;

		return (
			<Tag id={id + '-' + count} {...props} className="scroll-mt-20">
				{children}
			</Tag>
		);
	} catch (e: any) {
		console.error(e);
		return (
			<span>
				<Tag {...props}>{children}</Tag>
				<span>{e.message}</span>
			</span>
		);
	}
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

export const markdownProcessor = unified() //
	.use(remarkParse)
	.use(remarkRehype)
	.use(rehypeSanitize)
	.use(rehypeReact, {
		createElement: React.createElement,
		Fragment: React.Fragment,
		jsx,
		jsxs,
		components: {
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
		},
	});

export const htmlProcessor = unified() //
	.use(rehypeParse)
	.use(rehypeRemark)
	.use(remarkStringify);

type MarkdownProps = {
	className?: string;
	children: string;
} & Readonly<Options>;

export default function Markdown({ className, children, ...props }: MarkdownProps) {
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
			{...props}
		>
			{children}
		</ReactMarkdown>
	);
}
