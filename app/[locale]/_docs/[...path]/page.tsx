import fs from 'fs';
import { Metadata } from 'next';
import Link from 'next/link';
import removeMd from 'remove-markdown';

import TableOfContents from '@/app/[locale]/_docs/[...path]/table-of-contents';
import { getDocFolderPath, getDocPath, getNextPrevDoc, isDocExists, readDoc, readDocFolder } from '@/app/[locale]/_docs/doc-type';

import { CatchError } from '@/components/common/catch-error';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import BackButton from '@/components/ui/back-button';
import Divider from '@/components/ui/divider';

import { formatTitle, generateAlternate } from '@/lib/utils';
import { shared } from '@/mdx-components';

import './style.css';

type Props = { params: Promise<{ path: string[]; locale: string }> };

export default async function Page({ params }: Props) {
	const { path, locale } = await params;

	shared['idMaps'] = {};

	if (!isDocExists(locale, path)) {
		const folderPath = getDocFolderPath(locale, path);

		if (!fs.existsSync(folderPath)) {
			return (
				<div className="flex pointer-events-none h-full flex-1 flex-col items-center justify-center gap-4 z-50 absolute inset-0">
					<div className="pointer-events-auto">
						<h2 className="text-bold text-3xl">
							<Tran text="not-found" />
						</h2>
						<p>
							<Tran text="not-found-description" />
						</p>
						<div className="grid grid-cols-2 gap-2">
							<Link className="rounded-md text-center bg-brand p-2 text-sm text-brand-foreground" href="/">
								<Tran text="home" />
							</Link>
							<BackButton variant="primary" />
						</div>
					</div>
				</div>
			);
		}

		const folderContents = readDocFolder(folderPath);

		return (
			<ScrollContainer className="p-4 space-y-2">
				{folderContents.map((content, index) => (
					<h2 key={index} className="text-lg">
						<InternalLink href={content.path}>{content.header}</InternalLink>
					</h2>
				))}
			</ScrollContainer>
		);
	}

	const markdownFilePath = getDocPath(locale, path);
	const markdown = fs.readFileSync(markdownFilePath).toString();

	const { next, previous } = getNextPrevDoc(locale, path);
	const { Post } = await import(`@/docs/${locale}/${path.join('/')}.mdx`).then((result) => ({
		Post: result.default,
		metadata: result.metadata,
	}));

	return (
		<CatchError>
			<div className="max-w-[80ch] px-4 mb-4 mx-auto w-full flex flex-col">
				<main id="docs-markdown">
					<Post />
				</main>
				{(previous || next) && <Divider className="mt-6" />}
				<nav className="flex flex-wrap gap-2 justify-between items-center py-4 overflow-hidden flex-col md:flex-row">
					{previous && (
						<InternalLink className="mr-auto flex gap-0.5 items-end justify-end" href={`/docs/${previous.segments.join('/')}`}>
							<ChevronLeftIcon />
							<div className="grid grid-rows-2 items-end capitalize">
								<span>{previous.parent.toLowerCase()}</span>
								<span className="underline text-sm">{previous.header}</span>
							</div>
						</InternalLink>
					)}
					{next && (
						<InternalLink className="ml-auto flex gap-0.5 items-end justify-end" href={`/docs/${next.segments.join('/')}`}>
							<div className="grid grid-rows-2 items-end text-end capitalize">
								<span>{next.parent.toLowerCase()}</span>
								<span className="underline text-sm">{next.header}</span>
							</div>
							<ChevronRightIcon />
						</InternalLink>
					)}
				</nav>
			</div>
			<TableOfContents markdown={markdown} />
		</CatchError>
	);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale, path } = await params;

	if (!isDocExists(locale, path)) {
		return {
			title: 'Not found',
		};
	}

	const { header, content } = readDoc(locale, path);

	const title = removeMd(header);
	const description = removeMd(content).slice(0, Math.min(500, content.length));

	const images = content.match(/!\[.*?\]\((.*?)\)/g)?.map((match) => match.replace(/!\[(.*?)\]\((.*?)\)/, '$2')) || [];

	return {
		title: formatTitle(title),
		description,
		openGraph: {
			title: formatTitle(title),
			description,
			images,
		},
		alternates: generateAlternate(`/docs/${path.join('/')}`),
	};
}
