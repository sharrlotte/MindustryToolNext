import { getDocs } from '@/app/[locale]/docs/docmeta';

import InternalLink from '@/components/common/internal-link';
import ScrollContainer from '@/components/common/scroll-container';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { locales } from '@/i18n/config';

export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const docs = await getDocs(locale);

  if (docs.length === 0) {
    return <div>No content</div>;
  }

  return (
    <ScrollContainer className="p-4">
      <Accordion type="single" collapsible>
        {docs.map(({ category, title, docs }) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger className="py-1 px-3 bg-card rounded-sm text-base">{title}</AccordionTrigger>
            <AccordionContent>
              {docs.map(({ header, filename }) => (
                <InternalLink key={filename} href={`/${locale}/docs/${category}/${filename}`} className="text-sm px-4 py-2 rounded-sm hover:bg-muted/50 text-muted-foreground">
                  {header}
                </InternalLink>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollContainer>
  );
}
