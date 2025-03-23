import removeMd from 'remove-markdown';

import { HeadingCards } from '@/app/[locale]/docs/[...path]/heading-card';

import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';

import { ID_REPlACE_REGEX } from '@/mdx-components';

export interface Heading {
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
  const heading = extractHeadings(markdown);

  return (
    <ScrollContainer className="p-4 flex-col lg:flex hidden sticky top-0 right-0 h-fit max-w-[25rem] ml-auto min-w-[20rem]">
      {heading.length > 0 && (
        <h3 className="text-lg py-0">
          <Tran text="docs.table-of-content" asChild />
        </h3>
      )}
      <HeadingCards data={heading} />
    </ScrollContainer>
  );
}
