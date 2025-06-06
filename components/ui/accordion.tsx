import * as React from 'react';

import { cn } from '@/lib/utils';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => <AccordionPrimitive.Item ref={ref} className={cn(className)} {...props} />);
AccordionItem.displayName = 'AccordionItem';

type TriggerProps = {
	showChevron?: boolean;
};

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & TriggerProps
>(({ className, children, showChevron = true, ...props }, ref) => (
	<AccordionPrimitive.Header className="flex py-0">
		<AccordionPrimitive.Trigger
			ref={ref}
			className={cn('flex h-10 flex-1 items-center justify-between py-4 text-sm font-medium transition-all group', className)}
			{...props}
		>
			{children}
			{showChevron && (
				<ChevronDownIcon className="size-5 ml-auto mr-2 shrink-0 transition-transform duration-200 group-aria-expanded:rotate-0 -rotate-90 dark:text-foreground dark:hover:text-foreground" />
			)}
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
		{...props}
	>
		<div className={cn('pt-1', className)}>{children}</div>
	</AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
