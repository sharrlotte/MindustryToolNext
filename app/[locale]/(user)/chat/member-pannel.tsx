import { UsersIcon } from '@/components/common/icons';
import { MemberCard } from '@/components/messages/member-card';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/context/socket-context';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import React, { ReactNode, useMemo } from 'react';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

type MemberPanelState = 'open' | 'closed';

type MemberPanelProps = {
  room: string;
  className?: string;
};

export function MemberPanel({ className, room }: MemberPanelProps) {
  const { socket } = useSocket();
  const { state, isSmall } = useMemberPanel();

  const { data } = useQuery({
    queryKey: ['member-count', room],
    queryFn: () =>
      socket
        .onRoom(room) //
        .await({ method: 'GET_MEMBER', page: 0, size: 10 }),
  });

  const members = useMemo(() => (data && 'error' in data ? [] : data?.filter((item, index) => data.findIndex((v) => v.id === item.id) === index) || []), [data]);

  return (
    <motion.div
      className={cn('absolute right-0 flex h-full flex-shrink-0 flex-col items-start overflow-y-auto overflow-x-hidden border-l bg-background/20 sm:relative', className)}
      animate={state}
      variants={{
        open: {
          width: isSmall ? 300 : '100%',
        },
        closed: {
          width: 0,
        },
      }}
    >
      {members.map((user) => (
        <MemberCard key={user.id} user={user} />
      ))}
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
  const isSmall = useMediaQuery('(min-width: 640px)');

  const [state, setState] = useState<MemberPanelState>(isSmall ? 'open' : 'closed');

  useEffect(() => setState(isSmall ? 'open' : 'closed'), [isSmall]);

  return <MemberPanelContext.Provider value={{ state, isSmall, setState }}>{children}</MemberPanelContext.Provider>;
}

export function MemberPanelTrigger() {
  const { setState } = useMemberPanel();

  return (
    <Button className="p-0" title="Close" variant="icon" onClick={() => setState((prev) => (prev === 'open' ? 'closed' : 'open'))}>
      <UsersIcon />
    </Button>
  );
}
