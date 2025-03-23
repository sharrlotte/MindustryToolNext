import { ReactNode } from 'react';

import NavbarLink from '@/app/[locale]/(main)/navbar-link';
import { NestedPathElementContainer } from '@/app/[locale]/(main)/nested-path-element-container';
import NavbarVisible from '@/app/navbar-visible';

import { Filter } from '@/lib/utils';

export type NestedPathElementProps = {
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
  const { path } = segment;

  return (
    <NestedPathElementContainer segment={segment}>
      {path.map((item) => (
        <NavbarLink key={item.id} {...item}>
          {item.icon}
          <NavbarVisible>{item.name}</NavbarVisible>
        </NavbarLink>
      ))}
    </NestedPathElementContainer>
  );
}
