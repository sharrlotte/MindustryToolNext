'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import removeMd from 'remove-markdown';

import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';

import { useActiveHeading } from '@/hooks/use-active-heading';
import { cn } from '@/lib/utils';
import { ID_REPlACE_REGEX } from '@/mdx-components';

interface Heading {
  id: string;
  level: number;
  title: string;
  children: Heading[];
}

function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split('\n');
  const headings: Heading[] = [];
  const stack: Heading[] = [];
  const idMaps: Record<string, number | undefined> = {};

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.*)/);
    if (!match) continue;

    const level = match[1].length;
    const title = match[2].trim();
    const noMd = removeMd(title).trim();
    const id = title.toLowerCase().replaceAll(ID_REPlACE_REGEX, '-');
    const count = idMaps[id] ?? 0;
    idMaps[id] = count + 1;
    const heading: Heading = { id: id + '-' + count, level, title: noMd[0].toUpperCase() + noMd.slice(1), children: [] };

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
  const [activeId] = useActiveHeading();
  const heading = extractHeadings(markdown);

  return (
    <AnimatePresence>
      <ScrollContainer className="p-4 flex-col lg:flex hidden sticky top-0 h-fit">
        {heading.length > 0 && (
          <h3 className="text-lg py-0">
            <Tran text="docs.table-of-content" asChild />
          </h3>
        )}
        <HeadingCard data={heading} activeId={activeId} level={0} />
      </ScrollContainer>
    </AnimatePresence>
  );
}

function HeadingCard({ data, activeId, level }: { data: Heading[]; activeId: string | null; level: number }) {
  return (
    <div className="flex flex-col relative">
      {data.map((heading) =>
        heading.children.length === 0 ? (
          <Link
            key={heading.title}
            className={cn('text-base hover:text-brand text-secondary-foreground relative py-1', {
              'text-brand': activeId === heading.id,
            })}
            href={`#${heading.id}`}
            shallow
          >
            <div
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
            </div>
            <div className="absolute left-0 border-l-2 top-0 bottom-0"></div>
            {activeId && activeId === heading.id && <Anchor />}
          </Link>
        ) : (
          <div key={heading.title} className="py-0">
            <div
              className={cn('px-0 py-0 justify-start text-start text-nowrap hover:text-brand text-secondary-foreground', {
                'text-brand': activeId === heading.id, //
              })}
            >
              <Link className="relative text-base" href={`#${heading.id}`} shallow>
                <div
                  className={cn('relative py-1', {
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
                  {activeId && activeId === heading.id && <Anchor />}
                  <div className="absolute left-0 border-l-2 top-0 bottom-0"></div>
                </div>
              </Link>
            </div>
            <div className="pt-0">
              {heading.children.map((child) => (
                <HeadingCard key={child.title} data={[child]} level={level + (child.children.length === 0 ? 2 : 1)} activeId={activeId} />
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  );
}

function Anchor() {
  return <motion.div className="absolute left-0 border-l-2 top-0 bottom-0 border-brand z-50" layout layoutId="anchor" />;
}
