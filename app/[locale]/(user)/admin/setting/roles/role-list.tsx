'use client';

import type { Identifier, XYCoord } from 'dnd-core';
import dynamic from 'next/dynamic';
import { Suspense, useRef } from 'react';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Tran from '@/components/common/tran';
import { EllipsisButton } from '@/components/ui/ellipsis-button';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { cn } from '@/lib/utils';
import { getRoles, moveRole } from '@/query/role';
import { Role, RoleWithAuthorities } from '@/types/response/Role';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const ChangeRoleAuthorityDialog = dynamic(() => import('@/app/[locale]/(user)/admin/setting/roles/change-role-authority-dialog'));
const DeleteRoleButton = dynamic(() => import('@/app/[locale]/(user)/admin/setting/roles/delete-role-button'));
const UpdateRoleDialog = dynamic(() => import('@/app/[locale]/(user)/admin/setting/roles/update-role-dialog'));

type Props = {
  roles: RoleWithAuthorities[];
  bestRole: Role;
};
export function RoleList({ roles, bestRole }: Props) {
  const axios = useClientApi();
  const { invalidateByKey } = useQueriesData();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ['roles'],
    mutationFn: () => {
      const payload = data.map((role, index) => ({ id: role.id, index: roles.length - index }));

      return moveRole(axios, payload);
    },
    onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error.message }),
    onSettled: () => {
      invalidateByKey(['roles']);
    },
  });

  const { data } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getRoles(axios),
    initialData: roles,
  });

  function onDrop() {
    mutate();
  }

  function onHover(dragIndex: number, hoverIndex: number) {
    if (dragIndex >= bestRole.position || hoverIndex >= bestRole.position) {
      return;
    }

    queryClient.setQueryData<RoleWithAuthorities[]>(['roles'], () => {
      const updated = [...data];

      const [draggedItem] = updated.splice(dragIndex, 1);

      updated.splice(hoverIndex, 0, draggedItem);

      return updated;
    });
  }

  return (
    <Suspense>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col gap-2">
          {data.map((role, index) => (
            <RoleCard key={role.id} index={index} role={role} bestRole={bestRole} onDrop={onDrop} onHover={onHover} />
          ))}
        </div>
      </DndProvider>
    </Suspense>
  );
}

type RoleCardProps = {
  role: RoleWithAuthorities;
  index: number;
  bestRole?: Role;
  onDrop: () => void;
  onHover: (dragIndex: number, hoverIndex: number) => void;
};

interface DragItem {
  index: number;
  type: string;
}

export default function RoleCard({ index, role, bestRole, onDrop, onHover }: RoleCardProps) {
  const { id, name, color, position } = role;

  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: 'role',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    drop() {
      if (!ref.current) {
        return;
      }
      onDrop();
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onHover(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'role',
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      className={cn('grid bg-card rounded-md p-2 grid-cols-[100px_140px_auto_40px] gap-2 items-center h-12', {
        'opacity-50': isDragging,
      })}
      ref={ref}
      data-handler-id={handlerId}
    >
      <div>{position}</div>
      <Tran className="text-ellipsis overflow-hidden w-full h-full text-nowrap flex items-center" style={{ color }} text={name.toLowerCase()} />
      <div className="overflow-hidden text-ellipsis w-full h-full">
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
