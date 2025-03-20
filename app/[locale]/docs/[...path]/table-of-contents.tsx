'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { useActiveHeading } from '@/hooks/use-active-heading';
import { cn } from '@/lib/utils';
import { ID_REPlACE_REGEX } from '@/mdx-components';

interface Heading {
  level: number;
  title: string;
  children: Heading[];
}

function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split('\n');
  const headings: Heading[] = [];
  const stack: Heading[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{2,6})\s+(.*)/);
    if (!match) continue;

    const level = match[1].length;
    const title = match[2].trim();
    const heading: Heading = { level, title, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length > 0) {
      stack[stack.length - 1].children.push(heading);
    } else {
      headings.push(heading);
    }

    stack.push(heading);
  }

  return headings;
}
export default function TableOfContents({ markdown }: { markdown: string }) {
  const activeId = useActiveHeading();
  const heading = extractHeadings(markdown);

  return (
    <AnimatePresence>
      <ScrollContainer className="pl-4 flex-col lg:flex hidden">
        <h3 className="text-lg">
          <Tran text="docs.table-of-content" asChild />
        </h3>
        <HeadingCard data={heading} activeId={activeId} level={0} />
      </ScrollContainer>
    </AnimatePresence>
  );
}

function HeadingCard({ data, activeId, level }: { data: Heading[]; activeId: string | null; level: number }) {
  return (
    <Accordion className="flex flex-col relative" type="single" collapsible defaultValue={data[0]?.title}>
      {data.map((heading) =>
        heading.children.length <= 1 ? (
          <Link
            key={heading.title}
            className={cn('hover:text-brand text-secondary-foreground relative py-1', {
              'text-brand': activeId === heading.title.toLowerCase().replaceAll(ID_REPlACE_REGEX, '-'),
            })}
            href={`#${heading.title.toLowerCase().replaceAll(ID_REPlACE_REGEX, '-')}`}
            shallow
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
              {heading.title}
            </span>
            <div className="absolute left-0 border-l-2 top-0 bottom-0"></div>
            {activeId && activeId === heading.title.toLowerCase().replaceAll(ID_REPlACE_REGEX, '-') && <Anchor />}
          </Link>
        ) : (
          <AccordionItem key={heading.title} value={heading.title}>
            <AccordionTrigger
              className={cn('px-0 py-1 justify-start text-start text-nowrap hover:text-brand text-secondary-foreground', {
                'text-brand': activeId === heading.title.toLowerCase().replaceAll(ID_REPlACE_REGEX, '-'), //
              })}
            >
              <Link className="relative" href={`#${heading.title.toLowerCase().replaceAll(ID_REPlACE_REGEX, '-')}`} shallow>
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
                  {heading.title}
                </span>
                <div className="absolute left-0 border-l-2 top-0 bottom-0"></div>
                {activeId && activeId === heading.title.toLowerCase().replaceAll(ID_REPlACE_REGEX, '-') && <Anchor />}
              </Link>
            </AccordionTrigger>
            <AccordionContent className="mt-2 pt-0">
              {heading.children.map((child) => (
                <HeadingCard key={child.title} data={[child]} level={level + (child.children.length === 0 ? 2 : 1)} activeId={activeId} />
              ))}
            </AccordionContent>
          </AccordionItem>
        ),
      )}
    </Accordion>
  );
}

function Anchor() {
  return <motion.div className="absolute left-0 border-l-2 top-0 bottom-0 border-brand z-50" layout layoutId="anchor" />;
}
