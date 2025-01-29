import React, { ReactNode } from 'react';

import MediumNavFooter from '@/app/[locale]/medium-nav-footer';
import MediumNavbarCollapse from '@/app/[locale]/medium-navbar-collapse';
import MediumNavbarToggle from '@/app/[locale]/medium-navbar-toggle';
import NavbarLink from '@/app/[locale]/navbar-link';
import NestedPathElement from '@/app/[locale]/nested-path-element';
import { UserDisplay } from '@/app/[locale]/user-display';
import NavbarVisible from '@/app/navbar-visible';
import { PathGroup } from '@/app/routes';

import ErrorScreen from '@/components/common/error-screen';
import Divider from '@/components/ui/divider';

import { getSession } from '@/action/action';
import env from '@/constant/env';
import ProtectedElement from '@/layout/protected-element';
import { Filter, isError } from '@/lib/utils';

type NavigationBarProps = {
  pathGroups: PathGroup[];
};

export default function MediumScreenNavigationBar({ pathGroups }: NavigationBarProps) {
  return (
    <MediumNavbarCollapse>
      <NavHeader />
      <MediumNavItems pathGroups={pathGroups} />
      <NavbarVisible alt={<MediumNavFooter />}>
        <UserDisplay />
      </NavbarVisible>
    </MediumNavbarCollapse>
  );
}

type NavItemsProps = {
  pathGroups: PathGroup[];
};

function NavHeader() {
  return (
    <div className="flex justify-between h-fit">
      <NavbarVisible>
        <div className="flex flex-col">
          <h1 className="text-xl font-medium">MindustryTool</h1>
          <span className="overflow-hidden whitespace-nowrap text-xs">{env.webVersion}</span>
        </div>
      </NavbarVisible>
      <MediumNavbarToggle />
    </div>
  );
}

export function MediumNavItems({ pathGroups }: NavItemsProps) {
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

async function PathGroupElement({ group }: PathGroupElementProps) {
  const session = await getSession();

  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  const { key, name, filter } = group;

  return (
    <ProtectedElement session={session} filter={filter}>
      <nav className="space-y-1" key={key}>
        <NavbarVisible>{name}</NavbarVisible>
        {name && <Divider />}
        {group.paths.map((path, index) =>
          typeof path.path === 'string' ? ( //
            <PathElement key={index} segment={path as any} /> //
          ) : (
            <NestedPathElement key={index} segment={path as any} />
          ),
        )}
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
async function PathElement({ segment }: PathElementProps) {
  const session = await getSession();

  if (isError(session)) {
    return <ErrorScreen error={session} />;
  }

  return (
    <ProtectedElement session={session} filter={segment.filter}>
      <NavbarLink {...segment} />
    </ProtectedElement>
  );
}
