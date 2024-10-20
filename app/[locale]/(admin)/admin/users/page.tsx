import { getSession } from '@/action/action';
import { RoleTable } from '@/app/[locale]/(admin)/admin/users/role-table';
import { UserTable } from '@/app/[locale]/(admin)/admin/users/user-table';
import Tran from '@/components/common/tran';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';
import ProtectedElement from '@/layout/protected-element';
import React from 'react';

export const experimental_ppr = true;

export default async function Page() {
  const session = await getSession();

  return (
    <ServerTabs className="flex h-full w-full flex-col overflow-hidden p-2" name="tab" value="user" values={['user', 'role']}>
      <div className="flex w-full flex-wrap justify-start gap-2">
        <ServerTabsList>
          <ProtectedElement session={session} filter={{ authority: 'EDIT_USER_ROLE' }}>
            <ServerTabsTrigger value="user">
              <Tran text="user" />
            </ServerTabsTrigger>
          </ProtectedElement>
          <ProtectedElement session={session} filter={{ authority: 'EDIT_USER_ROLE' }}>
            <ServerTabsTrigger value="role">
              <Tran text="role" />
            </ServerTabsTrigger>
          </ProtectedElement>
        </ServerTabsList>
      </div>
      <ProtectedElement session={session} filter={{ authority: 'EDIT_USER_ROLE' }}>
        <ServerTabsContent className="h-full overflow-hidden" value="user">
          <UserTable />
        </ServerTabsContent>
      </ProtectedElement>
      <ProtectedElement session={session} filter={{ authority: 'EDIT_ROLE_AUTHORITY' }}>
        <ServerTabsContent className="h-full overflow-hidden" value="role">
          <RoleTable />
        </ServerTabsContent>
      </ProtectedElement>
    </ServerTabs>
  );
}
