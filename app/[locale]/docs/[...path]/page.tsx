import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import removeMd from 'remove-markdown';

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

  const { next, previous } = getNextPrevDoc(locale, path);
  const { Post } = await import(`@/docs/${locale}/${path.join('/')}.mdx`).then((result) => ({ Post: result.default, metadata: result.metadata }));

  return (
    <div className="gap-2 flex flex-col h-full">
      <Post />
      {(previous || next) && <Divider className="mt-6" />}
      <div className="flex flex-wrap gap-2 justify-between items-center pb-4 overflow-hidden flex-col md:flex-row">
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
      </div>
    </div>
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
