'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';

import NavbarLink from '@/app/[locale]/navbar-link';
import NavbarVisible from '@/app/navbar-visible';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { useNavBar } from '@/context/navbar-context';
import { useSession } from '@/context/session-context';
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
  const [value, setValue] = useState(false);
  const { id, name, icon, path, regex } = segment;

  return (
    <Accordion type="single" collapsible value={regex.some((r) => currentPath.match(r)) || value ? id : undefined} onValueChange={(value) => setValue(value === id)} className={cn('w-full', { 'w-10': !visible })}>
      <AccordionItem className="w-full" value={id}>
        <AccordionTrigger
          className={cn('flex h-10 items-center justify-center text-base gap-0 rounded-md p-1 hover:bg-brand hover:text-brand-foreground', {
            'justify-start gap-2 py-2': visible,
          })}
          showChevron={visible}
          onClick={() => setVisible(true)}
        >
          {icon}
          {visible && name}
        </AccordionTrigger>
        <AccordionContent className={cn('hidden space-y-1 pl-3', { block: visible })}>
          {path.map((item) => (
            <ProtectedElement key={item.id} session={session} filter={item.filter}>
              <NavbarLink {...item}>
                {item.icon}
                <NavbarVisible>{item.name}</NavbarVisible>
              </NavbarLink>
            </ProtectedElement>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
