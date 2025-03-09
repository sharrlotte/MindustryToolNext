import fs from 'fs';
import p from 'path';
import { ReactNode } from 'react';

import { DocMeta } from '@/app/[locale]/(user)/docs/docmeta';

import InternalLink from '@/components/common/internal-link';
import ScrollContainer from '@/components/common/scroll-container';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { cn } from '@/lib/utils';

export const dynamicParams = false;
export const revalidate = false;
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

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ path: string[]; locale: string }> }) {
  const { locale, path } = await params;
  const [category, docs] = path;

  const categoryFolder = p.join(process.cwd(), 'docs', p.normalize(locale));

  const data = await Promise.all(
    fs.readdirSync(categoryFolder).map(async (cat) => {
      const docsFolder = p.join(process.cwd(), 'docs', p.normalize(locale), p.normalize(cat));

      const titles = fs
        .readdirSync(docsFolder)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => {
          const content = fs.readFileSync(p.join(docsFolder, file)).toString();
          const index = content.indexOf('\n');
          const header = content.slice(0, index === -1 ? content.length : index).replace('#', '');

          return { title: header, docs: file.replace('.mdx', '') };
        });

      const meta: DocMeta = (await import(`@/docs/${locale}/${cat}/index.ts`)).default;

      return { titles, meta, cat };
    }),
  );

  console.log(category);

  return (
    <div className="p-4 grid grid-cols-[20rem_auto] divide-x h-full">
      <div className="pr-4 space-y-4">
        <Accordion className="space-y-4" type="single" collapsible defaultValue={category}>
          {data.map(({ meta, titles, cat }) => (
            <AccordionItem key={cat} value={cat}>
              <AccordionTrigger className="text-xl py-0 justify-start text-start text-nowrap">{meta.title}</AccordionTrigger>
              <AccordionContent>
                {titles.map((value) => (
                  <div key={value.docs}>
                    <div className="border-l"></div>
                    <InternalLink
                      href={`/${locale}/docs/${cat}/${value.docs}`}
                      className={cn('text-lg px-4 py-2 rounded-md hover:bg-muted/50 text-muted-foreground', {
                        'text-brand': value.docs === docs,
                      })}
                    >
                      {value.title}
                    </InternalLink>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <ScrollContainer className="px-4">{children}</ScrollContainer>
    </div>
  );
}
