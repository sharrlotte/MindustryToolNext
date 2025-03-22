import type { MDXComponents } from 'mdx/types';
import { ReactNode } from 'react';

import CopyButton from '@/components/button/copy-button';

import { cn } from '@/lib/utils';

export const ID_REPlACE_REGEX = /[\s\\/]+/g;

const idMaps: Record<string, number | undefined> = {};

function toId(children: ReactNode): string {
  if (typeof children === 'string') {
    return children;
  }

  throw new Error('Invalid heading: ' + children);
}

const Heading = ({ as: Tag, children, ...props }: { as: any; children: React.ReactNode }) => {
  const id = toId(children).toLowerCase().replaceAll(ID_REPlACE_REGEX, '-');
  const count = idMaps[id] ?? 0;
  idMaps[id] = count + 1;

  return (
    <Tag id={id + '-' + count} {...props} className="scroll-mt-20">
      {children}
    </Tag>
  );
};
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props: any) => <Heading as="h1" {...props} />,
    h2: (props: any) => <Heading as="h2" {...props} />,
    h3: (props: any) => <Heading as="h3" {...props} />,
    h4: (props: any) => <Heading as="h4" {...props} />,
    h5: (props: any) => <Heading as="h5" {...props} />,
    h6: (props: any) => <Heading as="h6" {...props} />,
    pre: ({ className, children, ...props }: any) => (
      <pre className={cn('relative group', className)} {...props}>
        {children}
      </pre>
    ),
    code: ({ className, children, ...props }: any) => (
      <>
        <code className={cn(className)} {...props}>
          {children}
        </code>
        <CopyButton className="top-1 right-1 absolute" data={children} content={children} variant="ghost" />
      </>
    ),
  };
}
