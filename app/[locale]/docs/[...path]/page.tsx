import { Metadata } from 'next';
import Link from 'next/link';
import removeMd from 'remove-markdown';

import { extractDocHeading, getNextPrevDoc, readDocContent } from '@/app/[locale]/docs/doc-type';

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/common/icons';
import Divider from '@/components/ui/divider';

import { formatTitle } from '@/lib/utils';

type Props = { params: Promise<{ path: string[]; locale: string }> };

export const dynamicParams = false;
export const revalidate = false;
export default async function Page({ params }: Props) {
  const { path, locale } = await params;
  const [Post, { next, previous }] = await Promise.all([import(`@/docs/${locale}/${path.join('/')}.mdx`).then((result) => result.default), getNextPrevDoc(locale, path)]);

  return (
    <div className="gap-2 min-h-full flex flex-col h-full">
      <Post />
      {(previous || next) && <Divider className="mt-auto" />}
      <div className="w-full flex justify-between items-center">
        {previous && (
          <Link className="mr-auto underline flex gap-0.5 items-center" href={`/docs/${previous.segments.join('/')}`}>
            <ChevronLeftIcon />
            {previous.header}
          </Link>
        )}
        {next && (
          <Link className="ml-auto underline flex gap-0.5 items-center" href={`/docs/${next.segments.join('/')}`}>
            {next.header}
            <ChevronRightIcon />
          </Link>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, path } = await params;

  const content = readDocContent(locale, path);
  const title = extractDocHeading(content);
  const description = removeMd(content).slice(0, Math.min(500, content.length));

  return {
    title: formatTitle(title),
    description,
    openGraph: {
      title,
      description,
    },
  };
}
