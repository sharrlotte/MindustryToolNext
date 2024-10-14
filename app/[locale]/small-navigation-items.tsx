import React, { ReactNode, useCallback, useState } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSession } from '@/context/session-context';
import ProtectedElement from '@/layout/protected-element';
import { cn } from '@/lib/utils';

import InternalLink from '@/components/common/internal-link';
import { Path, PathGroup } from '@/app/routes';
import { Button } from '@/components/ui/button';
import { useNavBar } from '@/zustand/nav-bar-store';
import { MenuIcon, NotificationIcon, UserIcon } from '@/components/common/icons';
import { motion } from 'framer-motion';
import OutsideWrapper from '@/components/common/outside-wrapper';
import env from '@/constant/env';
import { UserDisplay } from '@/app/[locale]/user-display';

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

type NavigationBarProps = {
  children: ReactNode;
  pathGroups: PathGroup[];
  bestMatch: string | null;
};

export function SmallScreenNavigationBar({ children, bestMatch, pathGroups }: NavigationBarProps) {
  const { isVisible, setVisible } = useNavBar();

  const showSidebar = useCallback(() => setVisible(true), [setVisible]);
  const hideSidebar = useCallback(() => setVisible(false), [setVisible]);

  return (
    <div className="grid h-full w-full grid-rows-[var(--nav)_1fr] overflow-hidden">
      <div className="flex h-nav w-full items-center justify-between bg-brand px-3 py-2 text-white shadow-lg">
        <Button title="Navbar" type="button" variant="link" size="icon" onFocus={showSidebar} onClick={showSidebar} onMouseEnter={showSidebar}>
          <MenuIcon />
        </Button>
        <div
          className={cn('pointer-events-none fixed inset-0 z-50 h-screen bg-transparent text-foreground', {
            'visible backdrop-blur-sm backdrop-brightness-50': isVisible,
          })}
        >
          <motion.div variants={sidebarVariants} animate={isVisible ? 'open' : 'closed'}>
            <div
              className={cn('pointer-events-auto fixed bottom-0 top-0 min-w-[280px] translate-x-[-100%] justify-between overflow-hidden bg-background duration-300', {
                'translate-x-0': isVisible,
              })}
            >
              <div
                className="h-full w-full overflow-hidden"
                onMouseLeave={hideSidebar} //
                onMouseEnter={showSidebar}
              >
                <OutsideWrapper className="h-full w-full overflow-hidden" onClickOutside={hideSidebar}>
                  <div className="flex h-full flex-col justify-between overflow-hidden p-2">
                    <div className="flex h-full flex-col overflow-hidden">
                      <span className="flex flex-col gap-2">
                        <span className="space-x-2 rounded-sm p-2">
                          <h1 className="text-xl font-medium">MindustryTool</h1>
                          <span className="text-xs">{env.webVersion}</span>
                        </span>
                      </span>
                      <NavItems pathGroups={pathGroups} bestMatch={bestMatch} onClick={hideSidebar} />
                    </div>
                    <UserDisplay />
                  </div>
                </OutsideWrapper>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="flex gap-2">
          <UserIcon />
          <NotificationIcon />
        </div>
      </div>
      <div className="relative h-full w-full overflow-hidden">{children}</div>
    </div>
  );
}

type NavItemsProps = {
  onClick: () => void;
  pathGroups: PathGroup[];
  bestMatch: string | null;
};

function NavItems({ pathGroups, bestMatch, onClick }: NavItemsProps) {
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

  return (
    <ProtectedElement key={key} filter={filter} session={session}>
      <nav className="space-y-1">
        <span>{name}</span>
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
          <span>{name}</span>
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
              <span>{name}</span>
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
