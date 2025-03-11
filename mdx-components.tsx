import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';

export const ID_REPlACE_REGEX = /[\s/]+/g;

const Heading = ({ as: Tag, children, ...props }: { as: any; children: React.ReactNode }) => {
  const id = children?.toString().toLowerCase().replace(ID_REPlACE_REGEX, '-');

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
    image: ({ src, ...props }: any) => {
      console.log(src);
      if (src && typeof src === 'string' && src.startsWith('./')) {
        const image = import(src);

        return <Image {...props} src={image} alt={props.alt} />;
      }

      return <Image {...props} src={src} alt={props.alt} />;
    },
  };
}
