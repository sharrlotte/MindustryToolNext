import type { MDXComponents } from 'mdx/types';

const Heading = ({ as: Tag, children, ...props }: { as: any; children: React.ReactNode }) => {
  const id = children?.toString().toLowerCase().replace(/\s+/g, '-'); // Generate an ID
  return (
    <Tag id={id} {...props} className="scroll-mt-20">
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
  };
}
