import { Variants, motion } from 'framer-motion';
import React, { ReactNode, useCallback, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

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
import { useNavBar } from '@/zustand/nav-bar-store';

type NavigationBarProps = {
  pathGroups: PathGroup[];
  bestMatch: string | null;
};

const sidebarVariants: Variants = {
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
  const { isVisible, setVisible } = useNavBar();

  const isSmall = useMediaQuery('(max-width: 640px)');

  const expand = isSmall ? true : isVisible;

  const toggleSidebar = useCallback(() => setVisible(!isVisible), [isVisible, setVisible]);

  return (
    <motion.div className="relative flex h-full overflow-hidden border-r min-w-nav" variants={sidebarVariants} initial={{ width: 'var(--nav)' }} animate={isVisible ? 'open' : 'closed'}>
      <div className={cn('flex h-full w-full flex-col p-1', { 'p-2': expand })}>
        <div className={cn('flex items-center justify-center p-2', { 'gap-1': expand })}>
          <motion.div className="overflow-hidden whitespace-nowrap" animate={{ display: expand ? 'block' : 'none' }}>
            <h1 className="text-xl font-medium">MindustryTool</h1>
          </motion.div>
          <motion.span className="overflow-hidden whitespace-nowrap text-xs" animate={{ display: expand ? 'block' : 'none' }}>
            {env.webVersion}
          </motion.span>
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
      <ProtectedElement session={session} filter>
        <InternalLink
          className={cn('flex h-10 items-center justify-center rounded-md p-1 text-sm font-bold transition-colors duration-300 hover:bg-brand hover:text-background dark:hover:text-foreground', {
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

const InternalPathGroupElement = ({ group, bestMatch }: PathGroupElementProps): ReactNode => {
  const { session } = useSession();
  const { key, name, filter } = group;

  const isSmall = useMediaQuery('(max-width: 640px)');
  const { isVisible } = useNavBar();

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
          className={cn('flex h-10 items-center justify-center rounded-md p-1 text-sm font-bold transition-colors duration-300 hover:bg-brand hover:text-background dark:hover:text-foreground', {
            'bg-brand text-background dark:text-foreground': path === bestMatch,
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
      <Accordion type="single" collapsible className="w-full" value={value} onValueChange={setValue}>
        <AccordionItem className="w-full" value={path.reduce((prev, curr) => prev + curr.name, '')}>
          <AccordionTrigger
            className={cn(
              'flex h-10 items-center justify-center gap-0 rounded-md p-1 text-sm font-bold transition-colors duration-300 hover:bg-brand hover:text-background dark:text-foreground dark:hover:text-foreground',
              {
                'bg-brand text-background dark:text-foreground': path.some((path) => path.path === bestMatch) && !value,
                'justify-start gap-2 py-2': expand,
                'w-10': !expand,
              },
            )}
            showChevron={expand}
            onClick={() => setVisible(true)}
          >
            {icon}
            {expand && name}
          </AccordionTrigger>
          <AccordionContent className={cn('hidden space-y-1 pl-3', { block: expand })}>
            {path.map((item) => (
              <ProtectedElement key={item.path} session={session} filter={item.filter}>
                <InternalLink
                  key={item.path}
                  className={cn('flex items-end gap-3 rounded-md px-1 py-2 text-sm font-bold transition-colors duration-300 hover:bg-brand hover:text-background dark:hover:text-foreground', {
                    'bg-brand text-background dark:text-foreground': item.path === bestMatch,
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
