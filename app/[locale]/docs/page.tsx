import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { readDocsByLocale, reduceDocs } from '@/app/[locale]/docs/doc-type';

import { Locale, locales } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle } from '@/lib/utils';


export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await getTranslation(locale, ['common', 'meta']);
  const title = t('docs');

  return {
    title: formatTitle(title),
    description: t('docs-description'),
    openGraph: {
      title: formatTitle(title),
      description: t('docs-description'),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const docs = readDocsByLocale(locale);
  const paths = docs.flatMap((doc) => reduceDocs([], doc)).map((seg) => seg.join('/'));

  if (paths.length === 0) {
    return <div>No content</div>;
  }

  redirect(`/docs/${paths[0]}`);
}
