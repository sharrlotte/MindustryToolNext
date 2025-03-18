import { Metadata } from 'next';

import { Doc, readDocsByLocale } from '@/app/[locale]/docs/docmeta';

import InternalLink from '@/components/common/internal-link';
import ScrollContainer from '@/components/common/scroll-container';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Locale, locales } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { cn, formatTitle } from '@/lib/utils';
import path from 'path';

export const dynamicParams = false;
export const revalidate = false;

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
    description: t('meta-docs-description'),
    openGraph: {
      title: formatTitle(title),
      description: t('meta-docs-description'),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const docs = await readDocsByLocale(locale);

  if (docs.length === 0) {
    return <div>No content</div>;
  }

  return (
    <ScrollContainer className="p-2">
      <Accordion className="space-y-2 w-full" type="single" collapsible>
        {docs.map((doc) => (
          <DocCard key={doc.segment} doc={doc} selectedSegments={[]} segments={[]} />
        ))}
      </Accordion>
    </ScrollContainer>
  );
}
function DocCard({ doc, segments, selectedSegments }: { doc: Doc; segments: string[]; selectedSegments: string[] }) {
  const currentSegments = [...segments, doc.segment];

  if (doc.children.length === 0) {
    return (
      <InternalLink
        href={`/docs/${path.join(...currentSegments)}`}
        className={cn('text-sm pl-2 py-2 rounded-r-md hover:bg-muted/80 text-muted-foreground hover:text-brand', {
          'text-brand': currentSegments.map((segment, index) => segment === selectedSegments[index]).every((v) => v),
        })}
      >
        {doc.title}
      </InternalLink>
    );
  }

  return (
    <AccordionItem value={doc.segment}>
      <AccordionTrigger className="text-base py-0 justify-start text-start text-nowrap w-full">{doc.title}</AccordionTrigger>
      <AccordionContent>
        {doc.children.map((doc) => (
          <DocCard key={doc.segment} doc={doc} selectedSegments={selectedSegments} segments={currentSegments} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
