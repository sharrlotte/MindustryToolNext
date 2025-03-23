import fs from 'fs';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import p from 'path';
import removeMd from 'remove-markdown';

import TableOfContents from '@/app/[locale]/docs/[...path]/table-of-contents';
import { extractDocHeading, getNextPrevDoc, isDocExists, readDocContent } from '@/app/[locale]/docs/doc-type';

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/common/icons';
import Divider from '@/components/ui/divider';

import { formatTitle } from '@/lib/utils';

import './stackoverflow-dark.css';

type Props = { params: Promise<{ path: string[]; locale: string }> };

export const revalidate = false;
export default async function Page({ params }: Props) {
  const { path, locale } = await params;

  if (!isDocExists(locale, path)) {
    return notFound();
  }

  const markdownFilePath = p.join(process.cwd(), 'docs', p.normalize(locale), path.map((segment) => p.normalize(segment)).join('/') + '.mdx');
  const markdown = fs.readFileSync(markdownFilePath).toString();

  const { next, previous } = getNextPrevDoc(locale, path);
  const { Post } = await import(`@/docs/${locale}/${path.join('/')}.mdx`).then((result) => ({ Post: result.default, metadata: result.metadata }));

  return (
    <>
      <div className="max-w-[80ch] px-4 mb-4 mx-auto w-full flex flex-col">
        <main id="docs-markdown">
          <Post />
        </main>
        {(previous || next) && <Divider className="mt-6" />}
        <nav className="flex flex-wrap gap-2 justify-between items-center py-4 overflow-hidden flex-col md:flex-row">
          {previous && (
            <Link className="mr-auto flex gap-0.5 items-end justify-end" href={`/docs/${previous.segments.join('/')}`}>
              <ChevronLeftIcon />
              <div className="grid grid-rows-2 items-end">
                <span>{previous.parent}</span>
                <span className="underline text-sm">{previous.header}</span>
              </div>
            </Link>
          )}
          {next && (
            <Link className="ml-auto flex gap-0.5 items-end justify-end" href={`/docs/${next.segments.join('/')}`}>
              <div className="grid grid-rows-2 items-end text-end">
                <span>{next.parent}</span>
                <span className="underline text-sm">{next.header}</span>
              </div>
              <ChevronRightIcon />
            </Link>
          )}
        </nav>
      </div>
      <TableOfContents markdown={markdown} />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, path } = await params;

  if (!isDocExists(locale, path)) {
    return notFound();
  }

  const content = readDocContent(locale, path);
  const title = extractDocHeading(content);
  const description = removeMd(content).slice(0, Math.min(500, content.length));

  return {
    title: formatTitle(title),
    description,
    openGraph: {
      title: formatTitle(title),
      description,
    },
  };
}
