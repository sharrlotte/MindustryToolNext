/* eslint-disable @next/next/no-img-element */
import type { MDXComponents } from 'mdx/types';
import { ReactNode } from 'react';

import CopyButton from '@/components/button/copy.button';
import InternalLink from '@/components/common/internal-link';

import { cn } from '@/lib/utils';

export const ID_REPlACE_REGEX = /[\s\\/]+/g;
const idMaps: Record<string, number | undefined> = {};

export const shared = {
	idMaps,
};

function toId(children: ReactNode): string {
	if (typeof children === 'string') {
		return children;
	}

	throw new Error('Invalid heading: ' + children);
}

const Heading = ({ as: Tag, children, ...props }: { as: any; children: React.ReactNode }) => {
	const id = toId(children).toLowerCase().replaceAll(ID_REPlACE_REGEX, '-');
	const count = shared['idMaps'][id] ?? 0;
	shared['idMaps'][id] = count + 1;

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
		a: (props: any) => <InternalLink {...props} className="text-brand" />,
		img: ({ src, ...props }: any) => {
			if (src) {
				const width = new URL(src).searchParams.get('w');
				const height = new URL(src).searchParams.get('h');

				return <img alt="" width={width} height={height} {...props} className="rounded-md" />;
			}
		},
	};
}
