import { motion } from 'framer-motion';
import React, { ReactNode, useCallback, useState } from 'react';

import { UserDisplay } from '@/app/[locale]/user-display';
import { Path, PathGroup } from '@/app/routes';

import LoginButton from '@/components/button/login-button';
import { MenuIcon } from '@/components/common/icons';
import InternalLink from '@/components/common/internal-link';
import OutsideWrapper from '@/components/common/outside-wrapper';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/divider';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/user/user-avatar';

import env from '@/constant/env';
import { useSession } from '@/context/session-context.client';
import ProtectedElement from '@/layout/protected-element';
import { cn } from '@/lib/utils';

const sidebarVariants = {
  open: {
    width: 'auto',
    transition: { type: 'spring', stiffness: 300, damping: 30, duration: 0.5 },
  },
  closed: {
    width: 'var(--nav)',
    transition: { type: 'spring', stiffness: 300, damping: 30, duration: 0.5 },
  },
};

type NavigationBarProps = {
  pathGroups: PathGroup[];
  bestMatch: string | null;
};

export default function SmallScreenNavigationBar({ bestMatch, pathGroups }: NavigationBarProps) {
  const {
    config: { showNav: isVisible },
    setConfig,
  } = useSession();

  const showSidebar = useCallback(() => setConfig('showNav', true), [setConfig]);
  const hideSidebar = useCallback(() => setConfig('showNav', false), [setConfig]);

  return (
    <div className="flex h-nav w-full items-center justify-between bg-brand px-2 py-2 shadow-lg">
      <Button title="Navbar" type="button" variant="link" size="icon" onFocus={showSidebar} onClick={showSidebar} onMouseEnter={showSidebar}>
        <MenuIcon />
      </Button>
      <div
        className={cn('pointer-events-none fixed inset-0 z-50 h-screen bg-transparent text-foreground', {
          'backdrop-blur-sm backdrop-brightness-50': isVisible,
        })}
      >
        <motion.div variants={sidebarVariants} initial={isVisible ? { width: sidebarVariants.open.width } : { width: sidebarVariants.closed.width }} animate={isVisible ? 'open' : 'closed'}>
          <div
            className={cn('pointer-events-auto fixed bottom-0 top-0 min-w-[280px] translate-x-[-100%] justify-between overflow-hidden bg-background transition-all duration-300 dark:bg-background/90', {
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
                      <span className="flex justify-between items-start rounded-sm p-2">
                        <div className="flex flex-col gap-2">
                          <h1 className="text-xl font-medium">MindustryTool</h1>
                          <span className="text-xs">{env.webVersion}</span>
                        </div>

                        <button className="text-2xl" onClick={hideSidebar}>
                          &times;
                        </button>
                      </span>
                    </span>
                    <NavItems pathGroups={pathGroups} bestMatch={bestMatch} onClick={hideSidebar} />
                  </div>
                  <Divider />
                  <UserDisplay />
                </div>
              </OutsideWrapper>
            </div>
          </div>
        </motion.div>
      </div>
      <NavUserAvatar />
    </div>
  );
}

function NavUserAvatar() {
  const { session, state } = useSession();

  if (state === 'loading') {
    return <Skeleton className="block h-8 w-8 rounded-full border border-border" />;
  }

  if (session === null) {
    return <LoginButton className="w-fit" />;
  }

  return <UserAvatar user={session} url="/users/@me" />;
}

type NavItemsProps = {
  onClick: () => void;
  pathGroups: PathGroup[];
  bestMatch: string | null;
};

function NavItems({ pathGroups, bestMatch, onClick }: NavItemsProps) {
  return (
    <section className="no-scrollbar space-y-4">
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

const InternalPathGroupElement = ({ group, bestMatch, onClick }: PathGroupElementProps): ReactNode => {
  const { session } = useSession();
  const { key, name, filter } = group;

  return (
    <ProtectedElement key={key} filter={filter} session={session}>
      <nav className="space-y-1">
        <span className="">{name}</span>
        {group.paths.map((path, index) => (
          <PathElement key={index} segment={path} bestMatch={bestMatch} onClick={onClick} />
        ))}
      </nav>
    </ProtectedElement>
  );
};
const PathGroupElement = React.memo(InternalPathGroupElement);

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
          className={cn('flex items-end gap-2 rounded-md px-1 py-2 text-opacity-50 opacity-80 transition-colors duration-300 hover:bg-brand hover:text-background hover:opacity-100 dark:hover:text-foreground', {
            'bg-brand text-background opacity-100 dark:text-foreground': path === bestMatch,
          })}
          href={path}
          onClick={onClick}
        >
          {icon}
          {name}
        </InternalLink>
      </ProtectedElement>
    );
  }

  return (
    <ProtectedElement session={session} filter={filter}>
      <Accordion type="single" collapsible className="w-full" value={value} onValueChange={setValue}>
        <AccordionItem className="w-full" value={path.reduce((prev, curr) => prev + curr.name, '')}>
          <AccordionTrigger
            className={cn('flex gap-2 rounded-md px-1 py-2 opacity-80 transition-colors duration-300 hover:bg-brand hover:text-background hover:opacity-100 dark:text-foreground dark:hover:text-foreground', {
              'bg-brand text-background opacity-100 hover:bg-brand hover:text-background hover:opacity-100 dark:text-foreground dark:hover:text-foreground': path.some((path) => path.path === bestMatch) && !value,
            })}
          >
            <div className="flex items-end gap-2">
              {icon}
              {name}
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-1 pl-3">
            {path.map((item) => (
              <ProtectedElement key={item.path} session={session} filter={item.filter}>
                <InternalLink
                  key={item.path}
                  className={cn('flex items-end gap-2 rounded-md px-1 py-2 opacity-80 duration-300 hover:bg-brand hover:text-background hover:opacity-100 dark:hover:text-foreground', {
                    'bg-brand text-background opacity-100 dark:text-foreground': item.path === bestMatch,
                  })}
                  href={item.path}
                  onClick={onClick}
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
