'use client';

import { ReactNode } from 'react';

import { useNavLink } from '@/context/nav-link-context';

type Props = {
  children: ReactNode;
};
export default function NavLinkContainer({ children }: Props) {
  const { setHovered } = useNavLink();

  return (
    <div className="no-scrollbar flex h-full gap-3 overflow-x-auto bg-card px-2" onMouseLeave={() => setHovered('Yes this is empty')} onTouchCancel={() => setHovered('Yes this is empty')}>
      {children}
    </div>
  );
}
