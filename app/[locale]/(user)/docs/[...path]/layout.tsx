import fs from 'fs';
import p from 'path';
import { ReactNode } from 'react';

import { DocMeta } from '@/app/[locale]/(user)/docs/docmeta';

import InternalLink from '@/components/common/internal-link';
import ScrollContainer from '@/components/common/scroll-container';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { cn } from '@/lib/utils';

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

  return (
    <div className="p-4 grid grid-cols-[20rem_auto] divide-x h-full">
      <div className="pr-4 space-y-4">
        <Accordion className="space-y-4" type="single" collapsible defaultValue={category}>
          {data.map(({ meta, titles, cat }, index) => (
            <AccordionItem key={index} value={cat}>
              <AccordionTrigger className="text-xl py-0 justify-start text-start text-nowrap">{meta.title}</AccordionTrigger>
              <AccordionContent>
                {titles.map((value) => (
                  <InternalLink
                    key={value.docs}
                    href={`/${locale}/docs/${category}/${value.docs}`}
                    className={cn('text-lg px-4 py-2 rounded-md hover:bg-muted/50', {
                      'text-brand': value.docs === docs,
                    })}
                  >
                    {value.title}
                  </InternalLink>
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
