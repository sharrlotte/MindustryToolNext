import { Metadata } from 'next';
import path from 'path';

import { Doc, readDocsByLocale } from '@/app/[locale]/docs/doc-type';

import InternalLink from '@/components/common/internal-link';
import ScrollContainer from '@/components/common/scroll-container';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Locale, locales } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { cn, formatTitle } from '@/lib/utils';

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

  if (docs.length === 0) {
    return <div>No content</div>;
  }

  return (
    <ScrollContainer className="p-4">
      <Accordion className="space-y-2 w-full" type="single" collapsible>
        {docs.map((doc) => (
          <DocCard key={doc.segment} doc={doc} selectedSegments={[]} segments={[]} level={0} />
        ))}
      </Accordion>
    </ScrollContainer>
  );
}
function DocCard({ doc, segments, selectedSegments, level }: { doc: Doc; segments: string[]; selectedSegments: string[]; level: number }) {
  const currentSegments = [...segments, doc.segment];

  if (doc.children.length === 0) {
    return (
      <InternalLink
        href={`/docs/${path.join(...currentSegments)}`}
        className={cn('text-sm py-2 rounded-md hover:bg-brand/30 text-muted-foreground hover:text-brand', {
          'text-brand': currentSegments.map((segment, index) => segment === selectedSegments[index]).every((v) => v),
        })}
      >
        <span
          className={cn({
            'pl-2': level === 0,
            'pl-4': level === 1, //
            'pl-6': level === 2,
            'pl-8': level === 3,
            'pl-10': level === 4,
            'pl-12': level === 5,
            'pl-14': level === 6,
          })}
        >
          {doc.title}
        </span>
      </InternalLink>
    );
  }

  return (
    <Accordion className="space-y-2 w-full" type="single" collapsible defaultValue={selectedSegments.join('/')}>
      <AccordionItem value={doc.segment}>
        <AccordionTrigger className="text-base py-0 justify-start text-start text-nowrap w-full">
          <span
            className={cn({
              'pl-2': level === 0,
              'pl-4': level === 1, //
              'pl-6': level === 2,
              'pl-8': level === 3,
              'pl-10': level === 4,
              'pl-12': level === 5,
              'pl-14': level === 6,
            })}
          >
            {doc.title}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          {doc.children.map((doc) => (
            <DocCard key={doc.segment} doc={doc} selectedSegments={selectedSegments} segments={currentSegments} level={level + 1} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
