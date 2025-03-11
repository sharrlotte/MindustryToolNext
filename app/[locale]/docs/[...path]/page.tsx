import fs from 'fs';
import { Metadata } from 'next';
import Link from 'next/link';
import p from 'path';
import removeMd from 'remove-markdown';

import { getNextPrevDoc } from '@/app/[locale]/docs/docmeta';

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/common/icons';
import Divider from '@/components/ui/divider';

import { formatTitle } from '@/lib/utils';

type Props = { params: Promise<{ path: string[]; locale: string }> };

export const dynamicParams = false;
export const revalidate = false;
export default async function Page({ params }: Props) {
  const { path, locale } = await params;

  

    if (path.length === 1){

    }

  const [category, docs] = path;

  const [Post, { next, previous }] = await Promise.all([import(`@/docs/${locale}/${path.join('/')}.mdx`).then((result) => result.default), getNextPrevDoc(locale, category, docs)]);

  return (
    <div className="space-y-2">
      <Post />
      <Divider />
      <div className="w-full flex justify-between items-center">
        {previous && (
          <Link className="mr-auto underline flex gap-0.5 items-center" href={`/docs/${category}/${previous.filename}`}>
            <ChevronLeftIcon />
            {previous.header}
          </Link>
        )}
        {next && (
          <Link className="ml-auto underline flex gap-0.5 items-center" href={`/docs/${category}/${next.filename}`}>
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
  const [category, docs] = path;

  const filePath = p.join(process.cwd(), 'docs', p.normalize(locale), p.normalize(category), p.normalize(docs) + '.mdx');
  const content = fs.readFileSync(filePath).toString();
  const index = content.indexOf('\n');
  const title = removeMd(content.slice(0, index === -1 ? content.length : index));
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
