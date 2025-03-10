'use client';

import Link from 'next/link';

import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { useActiveHeading } from '@/hooks/use-active-heading';
import { cn } from '@/lib/utils';

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
    <ScrollContainer className="pl-4 flex-col md:flex hidden">
      <h3>
        <Tran text="docs.table-of-content" asChild />
      </h3>
      <HeadingCard data={heading} activeId={activeId} />
    </ScrollContainer>
  );
}

function HeadingCard({ data, activeId }: { data: Heading[]; activeId: string | null }) {
  return (
    <Accordion className="flex flex-col gap-2" type="single" collapsible defaultValue={data[0].title}>
      {data.map((heading) =>
        heading.children.length === 0 ? (
          <Link
            key={heading.title}
            className={cn('hover:text-brand', {
              'text-brand': activeId === heading.title.toLowerCase().replace(/\s+/g, '-'),
            })}
            href={`#${heading.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {heading.title}
          </Link>
        ) : (
          <AccordionItem key={heading.title} value={heading.title}>
            <AccordionTrigger className="text-xl py-0 justify-start text-start text-nowrap hover:text-brand">
              <Link href={`#${heading.title}`}>{heading.title}</Link>
            </AccordionTrigger>
            <AccordionContent className="mt-2">
              {heading.children.map((child) => (
                <HeadingCard key={child.title} data={[child]} activeId={activeId} />
              ))}
            </AccordionContent>
          </AccordionItem>
        ),
      )}
    </Accordion>
  );
}
