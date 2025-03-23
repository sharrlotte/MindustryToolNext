import React, { ReactNode } from 'react';

import MediumNavFooter from '@/app/[locale]/(main)/medium-nav-footer';
import MediumNavbarCollapse from '@/app/[locale]/(main)/medium-navbar-collapse';
import MediumNavbarToggle from '@/app/[locale]/(main)/medium-navbar-toggle';
import NavbarLink from '@/app/[locale]/(main)/navbar-link';
import NestedPathElement from '@/app/[locale]/(main)/nested-path-element';
import { ProtectedPathElement } from '@/app/[locale]/(main)/protected-path-element';
import NavHeader from '@/app/[locale]/(main)/small-nav-header';
import { UserDisplay } from '@/app/[locale]/(main)/user-display';
import NavbarVisible from '@/app/navbar-visible';
import { PathGroup, groups } from '@/app/routes';

import ErrorScreen from '@/components/common/error-screen';
import Hydrated from '@/components/common/hydrated';
import Divider from '@/components/ui/divider';

import { useSession } from '@/context/session-context';
import ProtectedElement from '@/layout/protected-element';
import { Filter, isError } from '@/lib/utils';

export default function MediumScreenNavigationBar() {
  return (
    <MediumNavbarCollapse>
      <MediumNavHeader />
      <MediumNavItems />
      <NavbarVisible alt={<MediumNavFooter />}>
        <Hydrated>
          <UserDisplay />
        </Hydrated>
      </NavbarVisible>
    </MediumNavbarCollapse>
  );
}

function MediumNavHeader() {
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
  return (
    <section className="no-scrollbar space-y-2 overflow-hidden">
      {groups.map((group) =>
        group.filter ? ( //
          <ProtectedPathGroupElement key={group.key} group={group} />
        ) : (
          <PathGroupElement key={group.key} group={group} />
        ),
      )}
    </section>
  );
}

export type PathGroupElementProps = {
  group: PathGroup;
};

function ProtectedPathGroupElement({ group }: PathGroupElementProps) {
  const { session } = useSession();
  const { filter } = group;

  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  return (
    <ProtectedElement session={session} filter={filter}>
      <PathGroupElement group={group} />
    </ProtectedElement>
  );
}
export function PathGroupElement({ group }: PathGroupElementProps) {
  const { key, name, paths } = group;

  return (
    <nav className="space-y-1 uppercase" key={key}>
      {name && <Divider />}
      {paths.map((p) => {
        const { path, ...rest } = p;

        return typeof path === 'string' ? ( //
          rest.filter ? (
            <ProtectedPathElement key={rest.id} segment={{ ...rest, path }} />
          ) : (
            <PathElement key={rest.id} segment={{ ...rest, path }} />
          ) //
        ) : (
          <NestedPathElement key={rest.id} segment={{ ...rest, path }} />
        );
      })}
    </nav>
  );
}

export type PathElementProps = {
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
export function PathElement({ segment }: PathElementProps) {
  const { icon, name } = segment;

  return (
    <NavbarLink {...segment}>
      {icon}
      <NavbarVisible>{name}</NavbarVisible>
    </NavbarLink>
  );
}
