import { usePathname } from 'next/navigation';
import React, { ReactNode, useMemo, useState } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useSession } from '@/context/session-context';
import ProtectedElement from '@/layout/protected-element';
import { cn, hasAccess, max } from '@/lib/utils';

import InternalLink from '@/components/common/internal-link';
import { groups, Path, PathGroup, SubPath } from '@/app/routes';
import { useNavBar } from '@/zustand/nav-bar-store';
import { useMediaQuery } from 'usehooks-ts';
import { motion } from 'framer-motion';

type NavItemsProps = {
  onClick: () => void;
};

const sidebarVariants = {
  open: {
    width: 'auto',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  closed: {
    width: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

const PATH_PATTERN = /[a-zA-Z0-9-]+\/([a-zA-Z0-9/-]+)/;

export function NavItems({ onClick }: NavItemsProps) {
  const { session } = useSession();
  const pathName = usePathname();

  const bestMatch = useMemo(() => {
    const route = '/' + PATH_PATTERN.exec(pathName)?.at(1);

    const allPaths: string[] = groups
      .reduce<Path[]>((prev, curr) => prev.concat(curr.paths), []) //
      .reduce<string[]>((prev, curr) => prev.concat(getPath(curr.path)), []);

    return max(allPaths, (value) => value.length * (route.startsWith(value) ? 1 : 0));
  }, [pathName]);

  const routeGroups = useMemo(() => groups.filter((group) => hasAccess(session, group.filter) && group.paths.some(({ path, filter }) => hasAccess(session, filter) && (typeof path === 'string' ? true : path.some((sub) => hasAccess(session, sub.filter))))), [session]);

  return (
    <section className="no-scrollbar space-y-4 overflow-y-auto">
      {routeGroups.map((group) => (
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
        <motion.div className="overflow-hidden" variants={sidebarVariants} animate={expand ? 'open' : 'closed'}>
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
          <motion.div className="overflow-hidden" variants={sidebarVariants} animate={expand ? 'open' : 'closed'}>
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
              <motion.div className="overflow-hidden" variants={sidebarVariants} animate={expand ? 'open' : 'closed'}>
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

function getPath(path: SubPath): string[] {
  if (typeof path === 'string') {
    return [path];
  }

  return path.reduce<string[]>((prev, curr) => prev.concat(curr.path), []);
}
