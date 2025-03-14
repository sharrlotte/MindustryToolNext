import fs from 'fs';
import { notFound } from 'next/navigation';
import p from 'path';
import { ReactNode } from 'react';

import TableOfContents from '@/app/[locale]/docs/[...path]/table-of-contents';
import { getDocs } from '@/app/[locale]/docs/docmeta';

import InternalLink from '@/components/common/internal-link';
import ScrollContainer from '@/components/common/scroll-container';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { cn } from '@/lib/utils';

export const dynamicParams = false;
export const revalidate = false;

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ path: string[]; locale: string }> }) {
  const { locale, path } = await params;
  const [currentCategory, currentDocs] = path;

  const markdownFilePath = p.join(process.cwd(), 'docs', p.normalize(locale), p.normalize(currentCategory), p.normalize(currentDocs) + '.mdx');

  if (!fs.existsSync(markdownFilePath)) {
    return notFound();
  }

  const markdown = fs.readFileSync(markdownFilePath).toString();

  return (
    <div className="p-4 grid lg:grid-cols-[18rem_auto_18rem] lg:divide-x h-full relative">
      <NavBar locale={locale} currentCategory={currentCategory} currentDocs={currentDocs} />
      <ScrollContainer id="docs-markdown" className="px-4 gap-2">
        {children}
      </ScrollContainer>
      <TableOfContents markdown={markdown} />
    </div>
  );
}

type NavBarProps = {
  locale: string;
  currentCategory: string;
  currentDocs: string;
};

async function NavBar({ locale, currentCategory, currentDocs }: NavBarProps) {
  const data = await getDocs(locale);

  return (
    <ScrollContainer className="pr-4 space-y-2 hidden lg:flex">
      <Accordion className="space-y-2 w-full" type="single" collapsible defaultValue={currentCategory}>
        {data.map(({ title, docs, category }) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger className="text-base font-semibold py-0 justify-start text-start text-nowrap w-full">{title}</AccordionTrigger>
            <AccordionContent>
              {docs.map((doc) => (
                <div
                  className={cn('border-l hover:border-brand', {
                    'border-brand': doc.filename === currentDocs && category === currentCategory,
                  })}
                  key={doc.filename}
                >
                  <InternalLink
                    href={`/${locale}/docs/${category}/${doc.filename}`}
                    className={cn('text-sm pl-2 py-2 rounded-r-md hover:bg-muted/80 text-muted-foreground hover:text-brand', {
                      'text-brand': doc.filename === currentDocs && category === currentCategory,
                    })}
                  >
                    {doc.header}
                  </InternalLink>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollContainer>
  );
}

export function generateStaticParams() {
  const localeFolders = p.join(process.cwd(), 'docs');
  const locales = fs.readdirSync(localeFolders);

  return locales.flatMap((locale) => {
    const docsFolderPath = p.join(localeFolders, locale);
    const docsFolders = fs.readdirSync(docsFolderPath);

    return docsFolders.flatMap((folder) => {
      const docsPath = p.join(docsFolderPath, folder);
      const docs = fs.readdirSync(docsPath).filter((file) => file.endsWith('.mdx'));

      const paths = docs.map((file) => file.replace('.mdx', ''));

      return paths.map((path) => ({
        path: [folder, path],
        locale,
      }));
    });
  });
}
