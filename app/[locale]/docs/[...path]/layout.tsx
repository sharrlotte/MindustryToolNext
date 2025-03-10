import fs from 'fs';
import { notFound } from 'next/navigation';
import p from 'path';
import { ReactNode } from 'react';

import TableOfContents from '@/app/[locale]/docs/[...path]/table-of-contents';
import { DocMeta } from '@/app/[locale]/docs/docmeta';

import InternalLink from '@/components/common/internal-link';
import ScrollContainer from '@/components/common/scroll-container';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { cn } from '@/lib/utils';

export const dynamicParams = false;
export const revalidate = false;

async function getNavData(locale: string) {
  const categoryFolder = p.join(process.cwd(), 'docs', p.normalize(locale));

  const data = await Promise.all(
    fs.readdirSync(categoryFolder).map(async (category) => {
      const docsFolder = p.join(categoryFolder, p.normalize(category));

      const meta: DocMeta = (await import(`@/docs/${locale}/${category}/index.ts`)).default;

      const titles = meta.docs.map((file) => {
        const content = fs.readFileSync(p.join(docsFolder, file + '.mdx')).toString();
        const index = content.indexOf('\n');
        const header = content.slice(0, index === -1 ? content.length : index).replace('#', '');

        return { title: header, docs: file.replace('.mdx', '') };
      });

      return { titles, meta, category };
    }),
  );

  return data;
}

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ path: string[]; locale: string }> }) {
  const { locale, path } = await params;
  const [currentCategory, currentDocs] = path;

  const markdownFilePath = p.join(process.cwd(), 'docs', p.normalize(locale), p.normalize(currentCategory), p.normalize(currentDocs) + '.mdx');

  if (!fs.existsSync(markdownFilePath)) {
    return notFound();
  }

  const markdown = fs.readFileSync(markdownFilePath).toString();
  const data = await getNavData(locale);

  return (
    <div className="p-4 grid md:grid-cols-[20rem_auto_20rem] md:divide-x h-full relative">
      <ScrollContainer className="pr-4 space-y-4 absolute md:relative hidden md:flex">
        <Accordion className="space-y-4" type="single" collapsible defaultValue={currentCategory}>
          {data.map(({ meta, titles, category }) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="text-xl py-0 justify-start text-start text-nowrap">{meta.title}</AccordionTrigger>
              <AccordionContent>
                {titles.map((title) => (
                  <div
                    className={cn('border-l hover:border-brand', {
                      'border-brand': title.docs === currentDocs && category === currentCategory,
                    })}
                    key={title.docs}
                  >
                    <InternalLink
                      href={`/${locale}/docs/${category}/${title.docs}`}
                      className={cn('text-lg px-4 py-2 rounded-r-md hover:bg-muted/80 text-muted-foreground hover:text-brand', {
                        'text-brand': title.docs === currentDocs && category === currentCategory,
                      })}
                    >
                      {title.title}
                    </InternalLink>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollContainer>
      <ScrollContainer id="docs-markdown" className="px-4">
        {children}
      </ScrollContainer>
      <TableOfContents markdown={markdown} />
    </div>
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
