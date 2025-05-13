'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ReactNode } from 'react';

import { NestedPathElementProps } from '@/app/[locale]/(main)/nested-path-element';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { useNavBar } from '@/context/navbar.context';
import { useSession } from '@/context/session.context';
import { cn, hasAccess } from '@/lib/utils';

type NestedPathElementContainerProps = {
	children: ReactNode;
} & NestedPathElementProps;
export function NestedPathElementContainer({ children, segment }: NestedPathElementContainerProps) {
	const { visible, setVisible } = useNavBar();
	const currentPath = usePathname();
	const [value, setValue] = useState(false);
	const { id, name, icon, regex, path, filter } = segment;
	const { session } = useSession();

	if (hasAccess(session, filter) && path.some((p) => hasAccess(session, p.filter))) {
		return (
			<Accordion
				type="single"
				collapsible
				value={regex.some((r) => currentPath.match(r)) || value ? id : undefined}
				onValueChange={(value) => setValue(value === id)}
				className={cn('w-full', { 'w-10': !visible })}
			>
				<AccordionItem className="w-full" value={id}>
					<AccordionTrigger
						className={cn(
							'flex h-9 items-center justify-center text-foreground/60 gap-0 rounded-md p-1 hover:bg-brand hover:text-brand-foreground',
							{
								'justify-start gap-2 py-2': visible,
								'bg-brand': regex.some((r) => currentPath.match(r)) && !visible,
								'text-brand-foreground': regex.some((r) => currentPath.match(r)),
							},
						)}
						showChevron={visible}
						onClick={() => setVisible(true)}
					>
						{icon}
						{visible && name}
					</AccordionTrigger>
					<AccordionContent className={cn('hidden space-y-1 pl-3', { block: visible })}>{children}</AccordionContent>
				</AccordionItem>
			</Accordion>
		);
	}
}
