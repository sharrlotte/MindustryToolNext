import dynamic from 'next/dynamic';
import { ReactNode, Suspense } from 'react';

import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu';

const UserContextMenu = dynamic(() => import('@/components/user/user-context-menu'));

export default function UserAvatarContextMenu({ children }: { children: ReactNode }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <Suspense>
        <ContextMenuContent>
          <UserContextMenu />
        </ContextMenuContent>
      </Suspense>
    </ContextMenu>
  );
}
