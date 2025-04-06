import { AxiosInstance } from 'axios';
import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { UsersIcon } from '@/components/common/icons';
import InfinitePage from '@/components/common/infinite-page';
import Tran from '@/components/common/tran';
import { MemberCard } from '@/components/messages/member-card';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { getMembers } from '@/query/message';
import { PaginationQuerySchema } from '@/query/search-query';

type MemberPanelState = 'open' | 'closed';

type MemberPanelProps = {
  room: string;
  className?: string;
};

export function MemberPanel({ className, room }: MemberPanelProps) {
  const { state, isSmall } = useMemberPanel();

  return (
    <motion.div
      className={cn('absolute right-0 top-0 flex h-full flex-shrink-0 flex-col items-start no-scrollbar overflow-hidden border-l bg-background md:relative', className)}
      animate={state}
      variants={{
        open: {
          width: isSmall ? 'min(100%,300px)' : 300,
        },
        closed: {
          width: 0,
        },
      }}
    >
      <h4 className="p-2">
        <Tran text="member" asChild />
      </h4>
      <InfinitePage
        className="px-2 grid gap-1 w-full"
        queryKey={['room', room, 'members']}
        paramSchema={PaginationQuerySchema} //
        queryFn={(axios: AxiosInstance, params: { page: number; size: number }) => getMembers(axios, room, params).then((result) => result.filter((v, i, a) => a.findIndex((v2) => v.id === v2.id) === i))}
        noResult={<div></div>}
        end={<div></div>}
      >
        {(user) => <MemberCard key={user.id} user={user} />}
      </InfinitePage>
    </motion.div>
  );
}

type MemberPanelContextType = {
  state: MemberPanelState;
  isSmall: boolean;
  setState: (func: (prev: MemberPanelState) => MemberPanelState) => void;
};

export const MemberPanelContext = React.createContext<MemberPanelContextType>({
  state: 'open',
  isSmall: true,
  setState: () => {},
});

export const useMemberPanel = () => React.useContext(MemberPanelContext);

export function MemberPanelProvider({ children }: { children: ReactNode }) {
  const isSmall = useMediaQuery('(max-width: 640px)');

  const [state, setState] = useState<MemberPanelState>(isSmall ? 'closed' : 'open');

  useEffect(() => setState(isSmall ? 'closed' : 'open'), [isSmall]);

  return <MemberPanelContext.Provider value={{ state, isSmall, setState }}>{children}</MemberPanelContext.Provider>;
}

export function MemberPanelTrigger() {
  const { setState } = useMemberPanel();

  return (
    <Button className="p-0" variant="icon" onClick={() => setState((prev) => (prev === 'open' ? 'closed' : 'open'))}>
      <UsersIcon />
    </Button>
  );
}
