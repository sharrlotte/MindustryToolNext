import type { MDXComponents } from 'mdx/types';

export const ID_REPlACE_REGEX = /[\s\\/]+/g;

const Heading = ({ as: Tag, children, ...props }: { as: any; children: React.ReactNode }) => {
  const id = children?.toString().toLowerCase().replaceAll(ID_REPlACE_REGEX, '-');

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
    h4: (props: any) => <Heading as="h4" {...props} />,
    h5: (props: any) => <Heading as="h5" {...props} />,
    h6: (props: any) => <Heading as="h6" {...props} />,
  };
}
