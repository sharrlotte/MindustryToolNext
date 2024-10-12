import { RoleTable } from '@/app/[locale]/(admin)/admin/users/role-table';
import { UserTable } from '@/app/[locale]/(admin)/admin/users/user-table';
import Tran from '@/components/common/tran';
import {
  ServerTabs,
  ServerTabsContent,
  ServerTabsList,
  ServerTabsTrigger,
} from '@/components/ui/server-tabs';
import React from 'react';

export const experimental_ppr = true;
type Props = {
  searchParams: Promise<{
    tab?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const { tab } = await searchParams;

  return (
    <ServerTabs value={tab} values={['user', 'role']} name="tab">
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
      <ServerTabsContent value="user">
        <UserTable />
      </ServerTabsContent>
      <ServerTabsContent value="role">
        <RoleTable />
      </ServerTabsContent>
    </ServerTabs>
  );
}
