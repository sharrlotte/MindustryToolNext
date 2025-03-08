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

  const docsFolder = p.join(process.cwd(), 'docs', p.normalize(locale), p.normalize(category));

  const titles = fs
    .readdirSync(docsFolder)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const content = fs.readFileSync(p.join(docsFolder, file)).toString();
      const index = content.indexOf('\n');
      return { title: content.slice(0, index === -1 ? content.length : index), docs: file.replace('.mdx', '') };
    });

  const index: DocMeta = (await import(`@/docs/${locale}/${category}/index.ts`)).default;

  return (
    <div className="p-4 grid grid-cols-[20rem_auto] divide-x h-full">
      <div>
        <Accordion type="single" collapsible defaultValue={index.title}>
          <AccordionItem value={index.title}>
            <AccordionTrigger className="text-2xl py-0">{index.title}</AccordionTrigger>
            <AccordionContent>
              {titles.map((value) => (
                <InternalLink
                  key={value.docs}
                  href={`/${locale}/docs/${category}/${value.docs}`}
                  className={cn('text-xl', {
                    'text-brand': value.docs === docs,
                  })}
                >
                  {value.title}
                </InternalLink>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <ScrollContainer className="px-4">{children}</ScrollContainer>
    </div>
  );
}
