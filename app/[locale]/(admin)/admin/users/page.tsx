import { RoleTable } from '@/app/[locale]/(admin)/admin/users/role-table';
import { UserTable } from '@/app/[locale]/(admin)/admin/users/user-table';
import Tran from '@/components/common/tran';
import { ServerTabs, ServerTabsContent, ServerTabsList, ServerTabsTrigger } from '@/components/ui/server-tabs';
import React from 'react';

export const experimental_ppr = true;

export default async function Page() {
  return (
    <ServerTabs className="flex h-full w-full flex-col overflow-hidden p-2" name="tab" value="user" values={['user', 'role']}>
      <div className="flex w-full flex-wrap justify-start gap-2">
        <ServerTabsList>
          <ServerTabsTrigger value="user">
            <Tran text="user" />
          </ServerTabsTrigger>
          <ServerTabsTrigger value="role">
            <Tran text="role" />
          </ServerTabsTrigger>
        </ServerTabsList>
      </div>
      <ServerTabsContent className="h-full overflow-hidden" value="user">
        <UserTable />
      </ServerTabsContent>
      <ServerTabsContent className="h-full overflow-hidden" value="role">
        <RoleTable />
      </ServerTabsContent>
    </ServerTabs>
  );
}
