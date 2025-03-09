import fs from 'fs';
import { Metadata } from 'next';
import p from 'path';

import { formatTitle } from '@/lib/utils';

type Props = { params: Promise<{ path: string[]; locale: string }> };

export const dynamicParams = false;
export const revalidate = false;
export default async function Page({ params }: Props) {
  const { path, locale } = await params;

  const { default: Post } = await import(`@/docs/${locale}/${path.join('/')}.mdx`);

  return <Post />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, path } = await params;
  const [category, docs] = path;

  const filePath = p.join(process.cwd(), 'docs', p.normalize(locale), p.normalize(category), p.normalize(docs) + '.mdx');
  const content = fs.readFileSync(filePath).toString();
  const index = content.indexOf('\n');
  const header = content.slice(0, index === -1 ? content.length : index).replace('#', '');

  return {
    title: formatTitle(header),
    description: content,
    openGraph: {
      title: header,
      description: content,
    },
  };
}
