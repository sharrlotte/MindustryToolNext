import fs from 'fs';
import { notFound } from 'next/navigation';
import p from 'path';
import path from 'path';
import { ReactNode } from 'react';

import TableOfContents from '@/app/[locale]/docs/[...path]/table-of-contents';
import { Doc, readDocsByLocale } from '@/app/[locale]/docs/docmeta';

import { Hidden } from '@/components/common/hidden';
import { MenuIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import ScrollContainer from '@/components/common/scroll-container';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
      <div className="flex w-full">
        <div className="block lg:hidden ml-auto">
          <NavBarDialog locale={locale} selectedSegments={path} />
        </div>
        <div className="hidden lg:flex w-full">
          <NavBar locale={locale} selectedSegments={path} />
        </div>
      </div>
      <ScrollContainer id="docs-markdown" className="px-4 gap-2">
        <div className="overflow-hidden mx-auto container">{children}</div>
      </ScrollContainer>
      <TableOfContents markdown={markdown} />
    </div>
  );
}

type NavBarProps = {
  locale: string;
  selectedSegments: string[];
};

async function NavBarDialog({ locale, selectedSegments }: NavBarProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <MenuIcon className="size-6" />
      </DialogTrigger>
      <DialogContent className="p-8 h-full">
        <Hidden>
          <DialogTitle />
          <DialogDescription />
        </Hidden>
        <NavBar locale={locale} selectedSegments={selectedSegments} />
      </DialogContent>
    </Dialog>
  );
}

async function NavBar({ locale, selectedSegments }: NavBarProps) {
  const data = await readDocsByLocale(locale);

  return (
    <ScrollContainer className="pr-4 space-y-2 w-full">
      <Accordion className="space-y-2 w-full" type="single" collapsible defaultValue={selectedSegments.join('/')}>
        {data.map((doc) => (
          <NavBarDoc key={doc.segment} doc={doc} selectedSegments={selectedSegments} segments={[]} />
        ))}
      </Accordion>
    </ScrollContainer>
  );
}

function NavBarDoc({ doc, segments, selectedSegments }: { doc: Doc; segments: string[]; selectedSegments: string[] }) {
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
    <AccordionItem value={currentSegments.map((segment, index) => segment === selectedSegments[index]).every((v) => v) ? selectedSegments.join('/') : doc.segment}>
      <AccordionTrigger className="text-base py-0 justify-start text-start text-nowrap w-full">{doc.title}</AccordionTrigger>
      <AccordionContent>
        {doc.children.map((doc) => (
          <NavBarDoc key={doc.segment} doc={doc} selectedSegments={selectedSegments} segments={currentSegments} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

export function generateStaticParams() {
  const localeFolders = p.join(process.cwd(), 'docs');
  const locales = fs.readdirSync(localeFolders);

  return locales.flatMap((locale) => {
    const docs = readDocsByLocale(locale);

    return docs
      .flatMap((doc) => reduceDocs([], doc))
      .map((segments) => ({
        path: segments,
        locale,
      }));
  });
}

function reduceDocs(segments: string[], doc: Doc): string[][] {
  if (doc.children.length === 0) {
    return [[...segments, doc.segment]];
  }

  return doc.children.flatMap((child) => reduceDocs([...segments, doc.segment], child));
}
