import React, { ReactNode, useCallback, useState } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSession } from '@/context/session-context';
import ProtectedElement from '@/layout/protected-element';
import { cn } from '@/lib/utils';

import InternalLink from '@/components/common/internal-link';
import { Path, PathGroup } from '@/app/routes';
import { useNavBar } from '@/zustand/nav-bar-store';
import { useMediaQuery } from 'usehooks-ts';
import { motion } from 'framer-motion';
import { MenuIcon } from '@/components/common/icons';
import { Button } from '@/components/ui/button';
import OutsideWrapper from '@/components/common/outside-wrapper';
import env from '@/constant/env';
import { UserDisplay } from '@/app/[locale]/user-display';

type NavigationBarProps = {
  children: ReactNode;
  pathGroups: PathGroup[];
  bestMatch: string | null;
};

const sidebarVariants = {
  open: {
    width: 'auto',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  closed: {
    width: 'var(--nav)',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

const pathVariants = {
  open: {
    width: 'auto',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  closed: {
    width: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

export function MediumScreenNavigationBar({ children, pathGroups, bestMatch }: NavigationBarProps) {
  const { isVisible, setVisible } = useNavBar();

  const isSmall = useMediaQuery('(max-width: 640px)');

  const expand = isSmall ? true : isVisible;

  const showSidebar = useCallback(() => setVisible(true), [setVisible]);
  const hideSidebar = useCallback(() => setVisible(false), [setVisible]);

  return (
    <div className="grid h-full w-full grid-cols-[auto_1fr] justify-center overflow-hidden">
      <motion.div className="flex flex-col bg-card" variants={sidebarVariants} animate={isVisible ? 'open' : 'closed'}>
        <div
          className="h-full w-full overflow-hidden p-3"
          onMouseLeave={hideSidebar} //
          onMouseEnter={showSidebar}
        >
          <Button title="Navbar" type="button" variant="link" size="icon" onFocus={showSidebar} onClick={showSidebar} onMouseEnter={showSidebar}>
            <MenuIcon className="size-6" />
          </Button>
          <OutsideWrapper className="h-full w-full overflow-hidden" onClickOutside={hideSidebar}>
            <div className="flex h-full flex-col justify-between overflow-hidden">
              <div className="flex h-full flex-col items-center overflow-hidden">
                <span className="flex flex-col gap-2">
                  <span className="space-x-2 rounded-sm">
                    <div className={cn('hidden', { visible: expand })}>
                      <h1 className="text-xl font-medium">MindustryTool</h1>
                      <span className="text-xs">{env.webVersion}</span>
                    </div>
                  </span>
                </span>
                <MediumNavItems pathGroups={pathGroups} bestMatch={bestMatch} onClick={hideSidebar} />
              </div>
              <UserDisplay />
            </div>
          </OutsideWrapper>
        </div>
      </motion.div>
      <div className="relative h-full w-full overflow-hidden">{children}</div>
    </div>
  );
}

type NavItemsProps = {
  onClick: () => void;
  pathGroups: PathGroup[];
  bestMatch: string | null;
};

function MediumNavItems({ pathGroups, bestMatch, onClick }: NavItemsProps) {
  return (
    <section className="no-scrollbar space-y-4 overflow-y-auto">
      {pathGroups.map((group) => (
        <PathGroupElement key={group.key} group={group} bestMatch={bestMatch} onClick={onClick} />
      ))}
    </section>
  );
}

type PathGroupElementProps = {
  group: PathGroup;
  bestMatch: string | null;
  onClick: () => void;
};

const _PathGroupElement = ({ group, bestMatch, onClick }: PathGroupElementProps): ReactNode => {
  const { session } = useSession();
  const { key, name, filter } = group;
  const isSmall = useMediaQuery('(max-width: 640px)');
  const { isVisible } = useNavBar();

  const expand = isSmall ? true : isVisible;

  return (
    <ProtectedElement key={key} filter={filter} session={session}>
      <nav className="space-y-1">
        <motion.div className="overflow-hidden" variants={pathVariants} animate={expand ? 'open' : 'closed'}>
          {name}
        </motion.div>
        {group.paths.map((path, index) => (
          <PathElement key={index} segment={path} bestMatch={bestMatch} onClick={onClick} />
        ))}
      </nav>
    </ProtectedElement>
  );
};
const PathGroupElement = React.memo(_PathGroupElement);

type PathElementProps = {
  segment: Path;
  bestMatch: string | null;
  onClick: () => void;
};

function PathElement({ segment, bestMatch, onClick }: PathElementProps) {
  const { session } = useSession();
  const [value, setValue] = useState('');

  const isSmall = useMediaQuery('(max-width: 640px)');
  const { isVisible } = useNavBar();

  const expand = isSmall ? true : isVisible;

  const { filter, name, icon, path } = segment;

  if (typeof path === 'string') {
    return (
      <ProtectedElement key={path} session={session} filter={filter}>
        <InternalLink
          className={cn('flex items-end gap-3 rounded-md px-3 py-2 text-sm font-bold text-opacity-50 opacity-80 duration-300 hover:bg-brand hover:text-background hover:opacity-100 dark:hover:text-foreground', {
            'bg-brand text-background opacity-100 dark:text-foreground': path === bestMatch,
          })}
          href={path}
          onClick={onClick}
        >
          <span> {icon}</span>
          <motion.div className="overflow-hidden" variants={pathVariants} animate={expand ? 'open' : 'closed'}>
            {name}
          </motion.div>
        </InternalLink>
      </ProtectedElement>
    );
  }

  return (
    <ProtectedElement session={session} filter={filter}>
      <Accordion type="single" collapsible className="w-full" value={value} onValueChange={setValue}>
        <AccordionItem className="w-full" value={path.reduce((prev, curr) => prev + curr.name, '')}>
          <AccordionTrigger
            className={cn('flex gap-3 rounded-md px-3 py-2 text-sm font-bold opacity-80 duration-300 hover:bg-brand hover:text-background hover:opacity-100 dark:text-foreground dark:hover:text-foreground', {
              'bg-brand text-background opacity-100 hover:bg-brand hover:text-background hover:opacity-100 dark:text-foreground dark:hover:text-foreground': path.some((path) => path.path === bestMatch) && !value,
            })}
          >
            <div className="flex items-end gap-3">
              <span>{icon}</span>
              <motion.div className="overflow-hidden" variants={pathVariants} animate={expand ? 'open' : 'closed'}>
                {name}
              </motion.div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-1 pl-6">
            {path.map((item) => (
              <ProtectedElement key={item.path} session={session} filter={item.filter}>
                <InternalLink
                  key={item.path}
                  className={cn('flex items-end gap-3 rounded-md px-1 py-2 text-sm font-bold opacity-80 duration-300 hover:bg-brand hover:text-background hover:opacity-100 dark:hover:text-foreground', {
                    'bg-brand text-background opacity-100 dark:text-foreground': item.path === bestMatch,
                  })}
                  href={item.path}
                  onClick={onClick}
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
