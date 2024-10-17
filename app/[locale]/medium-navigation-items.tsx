import React, { ReactNode, useCallback, useState } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSession } from '@/context/session-context.client';
import ProtectedElement from '@/layout/protected-element';
import { cn } from '@/lib/utils';
import InternalLink from '@/components/common/internal-link';
import { Path, PathGroup } from '@/app/routes';
import { useNavBar } from '@/zustand/nav-bar-store';
import { useMediaQuery } from 'usehooks-ts';
import { motion, Variants } from 'framer-motion';
import { MenuIcon, SettingIcon } from '@/components/common/icons';
import { Button } from '@/components/ui/button';
import env from '@/constant/env';
import { UserDisplay } from '@/app/[locale]/user-display';
import Divider from '@/components/ui/divider';
import UserAvatar from '@/components/user/user-avatar';

type NavigationBarProps = {
  children: ReactNode;
  pathGroups: PathGroup[];
  bestMatch: string | null;
};

const sidebarVariants: Variants = {
  open: {
    width: 'auto',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  closed: {
    width: 'var(--nav)',
    transition: { type: '', stiffness: 300, damping: 30 },
  },
};

export function MediumScreenNavigationBar({ children, pathGroups, bestMatch }: NavigationBarProps) {
  const { isVisible, setVisible } = useNavBar();

  const isSmall = useMediaQuery('(max-width: 640px)');

  const expand = isSmall ? true : isVisible;

  const toggleSidebar = useCallback(() => setVisible(!isVisible), [isVisible, setVisible]);

  return (
    <div className="grid h-full w-full grid-cols-[auto_1fr] justify-center overflow-hidden">
      <motion.div className="relative flex h-full overflow-hidden border-r" variants={sidebarVariants} animate={isVisible ? 'open' : 'closed'}>
        <div className={cn('flex h-full w-full flex-col overflow-hidden p-1', { 'p-2': expand })}>
          <div className="flex items-center justify-center gap-1 p-2">
            <div className={cn('hidden', { block: expand })}>
              <h1 className="text-xl font-medium">MindustryTool</h1>
            </div>
            <span className={cn('hidden text-xs', { block: expand })}>{env.webVersion}</span>
            <Button title="Navbar" type="button" variant="link" size="icon" onClick={toggleSidebar}>
              <MenuIcon className="size-6 text-foreground" />
            </Button>
          </div>
          <div className="flex h-full flex-col justify-between overflow-hidden">
            <MediumNavItems pathGroups={pathGroups} bestMatch={bestMatch} />
            {expand ? <UserDisplay /> : <NavFooter />}
          </div>
        </div>
      </motion.div>
      <div className="relative h-full w-full overflow-hidden">{children}</div>
    </div>
  );
}

function NavFooter() {
  const { session } = useSession();
  const { isVisible } = useNavBar();

  const isSmall = useMediaQuery('(max-width: 640px)');

  const expand = isSmall ? true : isVisible;

  return (
    <div className="space-y-1">
      <Divider />
      <InternalLink
        className={cn(
          'flex h-10 items-center justify-center rounded-md p-1 text-sm font-bold text-opacity-50 opacity-80 duration-300 hover:bg-brand hover:text-background hover:opacity-100 dark:hover:text-foreground',
          {
            'justify-start gap-2 py-2': expand,
          },
        )}
        href="/users/@me/setting"
      >
        <SettingIcon />
      </InternalLink>
      {session && <UserAvatar className="size-10" url="/users/@me" user={session} />}
    </div>
  );
}

type NavItemsProps = {
  pathGroups: PathGroup[];
  bestMatch: string | null;
};

function MediumNavItems({ pathGroups, bestMatch }: NavItemsProps) {
  return (
    <section className="no-scrollbar space-y-2 overflow-y-auto">
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

const _PathGroupElement = ({ group, bestMatch }: PathGroupElementProps): ReactNode => {
  const { session } = useSession();
  const { key, name, filter } = group;

  const isSmall = useMediaQuery('(max-width: 640px)');
  const { isVisible } = useNavBar();

  const expand = isSmall ? true : isVisible;

  return (
    <ProtectedElement key={key} filter={filter} session={session}>
      <nav className="space-y-1">
        <span className={cn('hidden font-bold', { block: expand })}>{name}</span>
        {name && <Divider className={cn('block', { hidden: expand })} />}
        {group.paths.map((path, index) => (
          <PathElement key={index} segment={path} bestMatch={bestMatch} />
        ))}
      </nav>
    </ProtectedElement>
  );
};
const PathGroupElement = React.memo(_PathGroupElement);

type PathElementProps = {
  segment: Path;
  bestMatch: string | null;
};

function PathElement({ segment, bestMatch }: PathElementProps) {
  const { session } = useSession();
  const [value, setValue] = useState('');

  const isSmall = useMediaQuery('(max-width: 640px)');
  const { isVisible, setVisible } = useNavBar();

  const expand = isSmall ? true : isVisible;

  const { filter, name, icon, path } = segment;

  if (typeof path === 'string') {
    return (
      <ProtectedElement key={path} session={session} filter={filter}>
        <InternalLink
          className={cn(
            'flex h-10 items-center justify-center rounded-md p-1 text-sm font-bold text-opacity-50 opacity-80 duration-300 hover:bg-brand hover:text-background hover:opacity-100 dark:hover:text-foreground',
            {
              'bg-brand text-background opacity-100 dark:text-foreground': path === bestMatch,
              'justify-start gap-2 py-2': expand,
            },
          )}
          href={path}
        >
          <span> {icon}</span>
          <span className={cn('hidden', { block: expand })}>{name}</span>
        </InternalLink>
      </ProtectedElement>
    );
  }

  return (
    <ProtectedElement session={session} filter={filter}>
      <Accordion type="single" collapsible className="w-full" value={value} onValueChange={setValue}>
        <AccordionItem className="w-full" value={path.reduce((prev, curr) => prev + curr.name, '')}>
          <AccordionTrigger
            className={cn(
              'flex h-10 items-center justify-center gap-0 rounded-md p-1 text-sm font-bold opacity-80 duration-300 hover:bg-brand hover:text-background hover:opacity-100 dark:text-foreground dark:hover:text-foreground',
              {
                'bg-brand text-background opacity-100 hover:bg-brand hover:text-background hover:opacity-100 dark:text-foreground dark:hover:text-foreground':
                  path.some((path) => path.path === bestMatch) && !value,
                'justify-start gap-2 py-2': expand,
              },
            )}
            showChevron={expand}
            onClick={() => setVisible(true)}
          >
            <span>{icon}</span>
            <span className={cn('hidden', { block: expand })}>{name}</span>
          </AccordionTrigger>
          <AccordionContent className={cn('hidden space-y-1 pl-3', { block: expand })}>
            {path.map((item) => (
              <ProtectedElement key={item.path} session={session} filter={item.filter}>
                <InternalLink
                  key={item.path}
                  className={cn(
                    'flex items-end gap-3 rounded-md px-1 py-2 text-sm font-bold opacity-80 duration-300 hover:bg-brand hover:text-background hover:opacity-100 dark:hover:text-foreground',
                    {
                      'bg-brand text-background opacity-100 dark:text-foreground': item.path === bestMatch,
                    },
                  )}
                  href={item.path}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </InternalLink>
              </ProtectedElement>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ProtectedElement>
  );
}
