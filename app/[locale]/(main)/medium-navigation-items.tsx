'use client';

import React, { ReactNode } from 'react';

import MediumNavFooter from '@/app/[locale]/(main)/medium-nav-footer';
import MediumNavbarCollapse from '@/app/[locale]/(main)/medium-navbar-collapse';
import MediumNavbarToggle from '@/app/[locale]/(main)/medium-navbar-toggle';
import NavbarLink from '@/app/[locale]/(main)/navbar-link';
import NestedPathElement from '@/app/[locale]/(main)/nested-path-element';
import { UserDisplay } from '@/app/[locale]/(main)/user-display';
import NavbarVisible from '@/app/navbar-visible';
import { PathGroup } from '@/app/routes';

import ErrorScreen from '@/components/common/error-screen';
import Divider from '@/components/ui/divider';

import { useSession } from '@/context/session-context';
import useRoutes from '@/hooks/use-routes';
import ProtectedElement from '@/layout/protected-element';
import { Filter, isError } from '@/lib/utils';

export default function MediumScreenNavigationBar() {
  return (
    <MediumNavbarCollapse>
      <NavHeader />
      <MediumNavItems />
      <NavbarVisible alt={<MediumNavFooter />}>
        <UserDisplay />
      </NavbarVisible>
    </MediumNavbarCollapse>
  );
}

function NavHeader() {
  return (
    <div className="flex justify-between h-fit">
      <NavbarVisible>
        <NavHeader />
      </NavbarVisible>
      <MediumNavbarToggle />
    </div>
  );
}

export function MediumNavItems() {
  const pathGroups = useRoutes();

  return (
    <section className="no-scrollbar space-y-2 overflow-hidden">
      {pathGroups.map((group) => (
        <PathGroupElement key={group.key} group={group} />
      ))}
    </section>
  );
}

type PathGroupElementProps = {
  group: PathGroup;
};

function PathGroupElement({ group }: PathGroupElementProps) {
  const { session } = useSession();

  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  const { key, name, filter, paths } = group;

  return (
    <ProtectedElement session={session} filter={filter}>
      <nav className="space-y-1 uppercase" key={key}>
        <NavbarVisible>{name}</NavbarVisible>
        {name && <Divider />}
        {paths.map((p) => {
          const { path, ...rest } = p;

          return typeof path === 'string' ? ( //
            <PathElement key={rest.id} segment={{ ...rest, path }} /> //
          ) : (
            <NestedPathElement key={rest.id} segment={{ ...rest, path }} />
          );
        })}
      </nav>
    </ProtectedElement>
  );
}

type PathElementProps = {
  segment: {
    id: string;
    path: string;
    name: ReactNode;
    icon: ReactNode;
    enabled?: boolean;
    filter?: Filter;
    regex: string[];
  };
};
function PathElement({ segment }: PathElementProps) {
  const { session } = useSession();

  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  const { icon, name } = segment;

  return (
    <ProtectedElement session={session} filter={segment.filter}>
      <NavbarLink {...segment}>
        {icon}
        <NavbarVisible>{name}</NavbarVisible>
      </NavbarLink>
    </ProtectedElement>
  );
}
