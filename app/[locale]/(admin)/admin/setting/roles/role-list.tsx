'use client';

import type { Identifier } from 'dnd-core';
import dynamic from 'next/dynamic';
import { Suspense, useRef, useState } from 'react';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Tran from '@/components/common/tran';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { toast } from '@/components/ui/sonner';

import { revalidate } from '@/action/action';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { cn } from '@/lib/utils';
import { getRoles, updateRole } from '@/query/role';
import { Role, RoleWithAuthorities } from '@/types/response/Role';

import { useMutation, useQuery } from '@tanstack/react-query';

const ChangeRoleAuthorityDialog = dynamic(() => import('@/app/[locale]/(admin)/admin/setting/roles/change-role-authority-dialog'));
const DeleteRoleButton = dynamic(() => import('@/app/[locale]/(admin)/admin/setting/roles/delete-role-button'));
const UpdateRoleDialog = dynamic(() => import('@/app/[locale]/(admin)/admin/setting/roles/update-role-dialog'));

type Props = {
  roles: RoleWithAuthorities[];
  bestRole: Role;
};
export function RoleList({ roles, bestRole }: Props) {
  const axios = useClientApi();
  const { invalidateByKey } = useQueriesData();
  const [hoverId, setHoverId] = useState<number>();

  const { mutate } = useMutation({
    mutationKey: ['roles'],
    mutationFn: ({ role1, role2 }: { role1: Role; role2: Role }) => {
      const role1Position = role1.position;

      role1.position = role2.position;
      role2.position = role1Position;

      if (role1.position === role2.position) {
        role1.position += 1;
      }

      return Promise.all([updateRole(axios, role1.id, role1), updateRole(axios, role2.id, role2)]);
    },
    onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error.message }),
    onSettled: () => {
      invalidateByKey(['roles']);
      revalidate({ path: '/' });
    },
  });

  const { data } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getRoles(axios),
    initialData: roles,
  });

  function onDrop(dragId: number, hoverId: number) {
    setHoverId(undefined);

    const role1 = data.find((r) => r.id === dragId);
    const role2 = data.find((r) => r.id === hoverId);

    if (!role1 || !role2) {
      throw new Error('Role not found');
    }

    mutate({ role1, role2 });
  }
  return (
    <Suspense>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col gap-2">
          {data.map((role) => (
            <RoleCard key={role.id} isHovered={hoverId === role.id} role={role} bestRole={bestRole} onDrop={onDrop} onHover={setHoverId} />
          ))}
        </div>
      </DndProvider>
    </Suspense>
  );
}

type RoleCardProps = {
  role: RoleWithAuthorities;
  bestRole?: Role;
  isHovered: boolean;
  onDrop: (dragIndex: number, hoverIndex: number) => void;
  onHover: (hoverIndex: number) => void;
};

interface DragItem {
  id: number;
  type: string;
}

export default function RoleCard({ isHovered, role, bestRole, onDrop, onHover }: RoleCardProps) {
  const { id, name, color, position } = role;

  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: 'role',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    drop(item: DragItem) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.id;
      const hoverIndex = id;

      onDrop(dragIndex, hoverIndex);
    },
    hover() {
      if (!ref.current) {
        return;
      }

      const hoverIndex = id;

      onHover(hoverIndex);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'role',
    item: () => {
      return { id };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      className={cn('grid bg-card p-2 grid-cols-[100px_140px_auto_40px] gap-2 items-center', {
        'border-success border': isHovered,
        'border-destructive border opacity-50': isDragging,
      })}
      ref={ref}
      data-handler-id={handlerId}
    >
      <div>{position}</div>
      <Tran style={{ color }} text={name.toLowerCase()} />
      <div className="overflow-hidden text-ellipsis w-full">
        <ChangeRoleAuthorityDialog role={role} />
      </div>
      <div className="flex items-center justify-center">
        {bestRole && (bestRole.position > position || bestRole.name.toUpperCase() === 'SHAR') && (
          <EllipsisButton variant="ghost">
            <UpdateRoleDialog role={role} />
            <DeleteRoleButton role={role} />
          </EllipsisButton>
        )}
      </div>
    </div>
  );
}
