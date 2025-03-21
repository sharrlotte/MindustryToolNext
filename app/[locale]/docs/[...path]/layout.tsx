import fs from 'fs';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import p from 'path';
import path from 'path';
import { ReactNode, Suspense } from 'react';

import TableOfContents from '@/app/[locale]/docs/[...path]/table-of-contents';
import DocSearchBar from '@/app/[locale]/docs/doc-search-bar';
import { Doc, isDocExists, readDocsByLocale, reduceDocs } from '@/app/[locale]/docs/doc-type';
import LanguageSwitcher from '@/app/[locale]/docs/language-switcher';
import ThemeSwitcher from '@/app/[locale]/docs/theme-swicther';

import { Hidden } from '@/components/common/hidden';
import Hydrated from '@/components/common/hydrated';
import { MenuIcon, MindustryToolIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import ScrollContainer from '@/components/common/scroll-container';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Locale, locales } from '@/i18n/config';
import { cn } from '@/lib/utils';

export const revalidate = false;

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ path: string[]; locale: string }> }) {
  const { locale, path } = await params;

  const markdownFilePath = p.join(process.cwd(), 'docs', p.normalize(locale), path.map((segment) => p.normalize(segment)).join('/') + '.mdx');

  if (!fs.existsSync(markdownFilePath)) {
    return notFound();
  }

  const markdown = fs.readFileSync(markdownFilePath).toString();
  const availableLanguages = locales.filter((locale) => isDocExists(locale, path));

  return (
    <div className="h-full relative w-full grid grid-rows-[auto_1fr] overflow-hidden bg-card">
      <div className="flex border-b py-2 px-4 items-center overflow-hidden h-16 gap-4">
        <div className="flex items-center gap-2">
          <Link className="flex gap-2 items-center text-2xl font-semibold" href="/">
            <MindustryToolIcon className="size-8" />
            <span className="hidden lg:block text-brand">MindustryTool</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav className="items-center gap-4 hidden sm:flex">
            <Link className="flex gap-2 items-center text-base hover:text-brand" href="/docs">
              Docs
            </Link>
            <Link className="flex gap-2 items-center text-base hover:text-brand" href="/docs/wiki/getting-started">
              Wiki
            </Link>
            <Link className="flex gap-2 items-center text-base hover:text-brand" href="/docs/api/getting-started">
              Api
            </Link>
          </nav>
          <Suspense>
            <LanguageSwitcher availableLanguages={availableLanguages} currentLocale={locale as Locale} />
          </Suspense>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Hydrated>
            <ThemeSwitcher />
          </Hydrated>
          <DocSearchBar />
        </div>
      </div>
      <div className="flex flex-col md:grid md:grid-cols-[20rem_auto] h-full relative overflow-hidden">
        <div className="flex w-full lg:border-r p-4">
          <div className="block md:hidden ml-auto">
            <NavBarDialog locale={locale} selectedSegments={path} />
          </div>
          <div className="hidden md:flex w-full">
            <NavBar locale={locale} selectedSegments={path} />
          </div>
        </div>
        <ScrollContainer id="docs-markdown-scroll" className="px-4 gap-2 relative h-full grid lg:grid-cols-[auto_20rem]" additionalPadding="pr-4">
          <div id="docs-markdown" className="mx-auto max-w-[80ch] relative w-full">
            {children}
          </div>
          <TableOfContents markdown={markdown} />
        </ScrollContainer>
      </div>
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
      <DialogTrigger title="Navbar">
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
  const data = readDocsByLocale(locale);

  return (
    <ScrollContainer className="w-full">
      <nav className="space-y-6 w-full">
        {data.map((doc) => (
          <NavBarDoc locale={locale} key={doc.segment} doc={doc} selectedSegments={selectedSegments} segments={[]} level={0} />
        ))}
      </nav>
    </ScrollContainer>
  );
}

function NavBarDoc({ doc, segments, level, selectedSegments, locale }: { locale: string; doc: Doc; segments: string[]; selectedSegments: string[]; level: number }) {
  const currentSegments = [...segments, doc.segment];

  if (doc.children.length === 0) {
    return (
      <InternalLink
        href={`/${locale}/docs/${path.join(...currentSegments)}`}
        className={cn('text-base py-1 rounded-md hover:bg-secondary text-secondary-foreground hover:text-foreground', {
          'text-foreground bg-secondary': currentSegments.map((segment, index) => segment === selectedSegments[index]).every((v) => v),
        })}
      >
        <span
          className={cn('pr-2', {
            'pl-2': level === 1,
            'pl-4': level === 2, //
            'pl-6': level === 3,
            'pl-8': level === 4,
            'pl-10': level === 5,
            'pl-12': level === 6,
            'pl-14': level === 7,
          })}
        >
          {doc.title}
        </span>
      </InternalLink>
    );
  }

  if (level === 0) {
    return (
      <div className="space-y-1">
        <h2 className="text-base py-0 pl-2 font-semibold">{doc.title}</h2>
        <section className="space-y-1">
          {doc.children.map((doc) => (
            <NavBarDoc locale={locale} key={doc.segment} doc={doc} selectedSegments={selectedSegments} segments={currentSegments} level={level + 1} />
          ))}
        </section>
      </div>
    );
  }

  return (
    <Accordion className="space-y-1 w-full" type="single" collapsible defaultValue={selectedSegments.join('/')}>
      <AccordionItem value={selectedSegments.map((segment, index) => index > currentSegments.length - 1 || segment === currentSegments[index]).every((v) => v) ? selectedSegments.join('/') : doc.segment}>
        <AccordionTrigger className="text-base py-0 justify-start text-start text-nowrap w-full">
          <span
            className={cn('text-base font-normal text-secondary-foreground pr-2', {
              'pl-2': level === 1,
              'pl-4': level === 2, //
              'pl-6': level === 3,
              'pl-8': level === 4,
              'pl-10': level === 5,
              'pl-12': level === 6,
              'pl-14': level === 7,
            })}
          >
            {doc.title}
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-1">
          {doc.children.map((doc) => (
            <NavBarDoc locale={locale} key={doc.segment} doc={doc} selectedSegments={selectedSegments} segments={currentSegments} level={level + 1} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
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
