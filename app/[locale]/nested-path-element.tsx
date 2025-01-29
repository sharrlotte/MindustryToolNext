'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import NavbarLink from '@/app/[locale]/navbar-link';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { useNavBar } from '@/context/navbar-context';
import { useSession } from '@/context/session-context.client';
import ProtectedElement from '@/layout/protected-element';
import { Filter, cn } from '@/lib/utils';

type NestedPathElementProps = {
  segment: {
    id: string;
    name: ReactNode;
    icon: ReactNode;
    enabled?: boolean;
    filter?: Filter;
    regex: string[];
    path: {
      id: string;
      path: string;
      name: ReactNode;
      icon: ReactNode;
      enabled?: boolean;
      filter?: Filter;
      regex: string[];
    }[];
  };
};

export default function NestedPathElement({ segment }: NestedPathElementProps) {
  const { visible, setVisible } = useNavBar();
  const { session } = useSession();
  const currentPath = usePathname();

  const { id, name, icon, path, regex } = segment;

  return (
    <Accordion type="single" collapsible className={cn('w-full', { 'w-10': !visible })}>
      <AccordionItem className="w-full" value={id}>
        <AccordionTrigger
          className={cn('flex h-10 items-center justify-center text-base gap-0 rounded-md p-1 hover:bg-brand hover:text-brand-foreground', {
            'justify-start gap-2 py-2': visible,
            'bg-brand text-brand-foreground': regex.some((r) => currentPath.match(r)),
          })}
          showChevron={visible}
          onClick={() => setVisible(true)}
        >
          {icon}
          {visible && name}
        </AccordionTrigger>
        <AccordionContent className={cn('hidden space-y-1 pl-3', { block: visible })}>
          {path.map((item) => (
            <ProtectedElement key={item.path} session={session} filter={item.filter}>
              <NavbarLink {...item} />
            </ProtectedElement>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
