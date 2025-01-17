import { motion } from 'framer-motion';
import React, { ReactNode, useCallback, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import NotificationDialog from '@/app/[locale]/notification-dialog';
import { UserDisplay } from '@/app/[locale]/user-display';
import { Path, PathGroup } from '@/app/routes';

import { MenuIcon, SettingIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/divider';
import UserAvatar from '@/components/user/user-avatar';

import env from '@/constant/env';
import { useSession } from '@/context/session-context.client';
import ProtectedElement from '@/layout/protected-element';
import { cn } from '@/lib/utils';

type NavigationBarProps = {
  pathGroups: PathGroup[];
  bestMatch: string | null;
};

const sidebarVariants = {
  open: {
    width: '235px',
    transition: { type: 'spring', stiffness: 250, damping: 25, duration: 0.5 },
  },
  closed: {
    width: 'var(--nav)',
    transition: { type: 'spring', stiffness: 200, damping: 25, duration: 0.5 },
  },
};

export default function MediumScreenNavigationBar({ pathGroups, bestMatch }: NavigationBarProps) {
  const {
    config: { showNav: isVisible },
    setConfig,
  } = useSession();

  const isSmall = useMediaQuery('(max-width: 640px)');

  const expand = isSmall ? true : isVisible;

  const toggleSidebar = useCallback(() => setConfig('showNav', !isVisible), [isVisible, setConfig]);

  return (
    <motion.div
      className={cn('relative gap-2 flex h-full overflow-hidden border-r min-w-nav w-full flex-col p-1', { 'p-2': expand })}
      variants={sidebarVariants}
      initial={isVisible ? { width: sidebarVariants.open.width } : { width: sidebarVariants.closed.width }}
      animate={isVisible ? 'open' : 'closed'}
    >
      <div className={cn('flex justify-between h-fit', { 'gap-1': expand })}>
        {isVisible && (
          <div className="flex flex-col">
            <h1 className="text-xl font-medium">MindustryTool</h1>
            <span className="overflow-hidden whitespace-nowrap text-xs">{env.webVersion}</span>
          </div>
        )}
        <Button title="Navbar" className="justify-center aspect-square size-10 items-center" type="button" variant="link" size="icon" onClick={toggleSidebar}>
          <MenuIcon className="size-6 text-foreground" />
        </Button>
      </div>
      <MediumNavItems pathGroups={pathGroups} bestMatch={bestMatch} />
      {expand ? <UserDisplay /> : <NavFooter />}
    </motion.div>
  );
}

function NavFooter() {
  const {
    session,
    config: { showNav: isVisible },
  } = useSession();

  const isSmall = useMediaQuery('(max-width: 640px)');

  const expand = isSmall ? true : isVisible;

  return (
    <div className="space-y-1 mt-auto">
      <Divider />
      <NotificationDialog />
      <ProtectedElement session={session} filter>
        <InternalLink
          className={cn('flex h-10 items-center justify-center rounded-md p-1 hover:bg-brand hover:text-brand-foreground', {
            'justify-start gap-2 py-2': expand,
          })}
          href="/users/@me/setting"
        >
          <SettingIcon />
        </InternalLink>
        {session && <UserAvatar className="size-10" url="/users/@me" user={session} />}
      </ProtectedElement>
    </div>
  );
}

type NavItemsProps = {
  pathGroups: PathGroup[];
  bestMatch: string | null;
};

function MediumNavItems({ pathGroups, bestMatch }: NavItemsProps) {
  return (
    <section className="no-scrollbar space-y-2">
      {pathGroups.map((group) => (
        <PathGroupElement key={group.key} group={group} bestMatch={bestMatch} />
      ))}
    </section>
  );
}

type PathGroupElementProps = {
  group: PathGroup;
  bestMatch: string | null;
};

const InternalPathGroupElement = ({ group, bestMatch }: PathGroupElementProps): ReactNode => {
  const {
    session,
    config: { showNav: isVisible },
  } = useSession();

  const { key, name, filter } = group;

  const isSmall = useMediaQuery('(max-width: 640px)');

  const expand = isSmall ? true : isVisible;

  return (
    <ProtectedElement key={key} filter={filter} session={session}>
      <nav className="space-y-1">
        {expand && name}
        {name && <Divider />}
        {group.paths.map((path, index) => (
          <PathElement key={index} segment={path} bestMatch={bestMatch} />
        ))}
      </nav>
    </ProtectedElement>
  );
};
const PathGroupElement = React.memo(InternalPathGroupElement);

type PathElementProps = {
  segment: Path;
  bestMatch: string | null;
};

function PathElement({ segment, bestMatch }: PathElementProps) {
  const [value, setValue] = useState('');

  const isSmall = useMediaQuery('(max-width: 640px)');
  const {
    session,
    config: { showNav: isVisible },
    setConfig,
  } = useSession();

  const expand = isSmall ? true : isVisible;

  const { filter, name, icon, path } = segment;

  if (typeof path === 'string') {
    return (
      <ProtectedElement key={path} session={session} filter={filter}>
        <InternalLink
          className={cn('flex h-10 items-center justify-center rounded-md p-1 hover:bg-brand hover:text-brand-foreground', {
            'bg-brand text-brand-foreground': path === bestMatch,
            'justify-start gap-2 py-2': expand,
            'w-10': !expand,
          })}
          href={path}
        >
          {icon}
          {expand && name}
        </InternalLink>
      </ProtectedElement>
    );
  }

  return (
    <ProtectedElement session={session} filter={filter}>
      <Accordion type="single" collapsible className={cn('w-full', { 'w-10': !expand })} value={value} onValueChange={setValue}>
        <AccordionItem className="w-full" value={path.reduce((prev, curr) => prev + curr.name, '')}>
          <AccordionTrigger
            className={cn('flex h-10 items-center justify-center text-base gap-0 rounded-md p-1 hover:bg-brand hover:text-brand-foreground', {
              'bg-brand text-brand-foreground': path.some((path) => path.path === bestMatch) && !value,
              'justify-start gap-2 py-2': expand,
            })}
            showChevron={expand}
            onClick={() => setConfig('showNav', true)}
          >
            {icon}
            {expand && name}
          </AccordionTrigger>
          <AccordionContent className={cn('hidden space-y-1 pl-3', { block: expand })}>
            {path.map((item) => (
              <ProtectedElement key={item.path} session={session} filter={item.filter}>
                <InternalLink
                  key={item.path}
                  className={cn('flex text-base items-end gap-3 rounded-md px-1 py-2 hover:bg-brand hover:text-brand-foreground', {
                    'bg-brand text-brand-foreground': item.path === bestMatch,
                  })}
                  href={item.path}
                >
                  {item.icon}
                  {item.name}
                </InternalLink>
              </ProtectedElement>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ProtectedElement>
  );
}
