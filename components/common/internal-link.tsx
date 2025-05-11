'use client';

import { VariantProps, cva } from 'class-variance-authority';
import Link from 'next/link';
import React from 'react';

import env from '@/constant/env';
import useLocaleStore from '@/hooks/use-current-locale';
import { cn } from '@/lib/utils';

const linkVariants = cva('inline-flex gap-2', {
	variants: {
		variant: {
			default: '',
			primary: 'text-brand hover:text-brand',
			'button-primary': 'rounded-sm border bg-brand p-2 text-sm text-brand-foreground border-brand',
			'button-secondary': 'items-center flex gap-2 rounded-sm bg-secondary px-2 py-1.5',
			command: 'hover:bg-accent justify-start gap-1 flex items-center p-2 w-full rounded-sm',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

export type InternalLinkVariants = VariantProps<typeof linkVariants>;

export type InternalLinkProps = Omit<React.ButtonHTMLAttributes<HTMLAnchorElement>, 'imageMaterial'> &
	VariantProps<typeof linkVariants> & {
		asChild?: boolean;
		shallow?: boolean;
	} & {
		href: string;
	};

export default function InternalLink({ className, variant, title, href, shallow, children, ...props }: InternalLinkProps) {
	const { currentLocale } = useLocaleStore();
	href = href.replace(env.url.base, '');

	const hrefWithoutLocale = (() => {
		const parts = href.split('/');
		if (env.locales.includes(parts[1] as any)) {
			return '/' + parts.slice(2).join('/');
		}
		return href;
	})();

	const localizedHref = `/${currentLocale}${hrefWithoutLocale.startsWith('/') ? '' : '/'}${hrefWithoutLocale}`.replaceAll(
		'//',
		'/',
	);

	if (href.startsWith('http') && !href.startsWith(env.url.base)) {
		return (
			<a className={cn(linkVariants({ variant, className }))} {...props} href={href} title={title} target="_blank">
				{children}
			</a>
		);
	}

	return (
		<Link className={cn(linkVariants({ variant, className }))} {...props} href={localizedHref} shallow={shallow} title={title}>
			{children}
		</Link>
	);
}
