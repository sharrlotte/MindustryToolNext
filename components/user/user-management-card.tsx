import { CheckSquare, Square } from 'lucide-react';
import React, { useState } from 'react';

import CopyButton from '@/components/button/copy-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import UserAvatar from '@/components/user/user-avatar';
import { useMe } from '@/context/session-context';
import useClientAPI from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Role } from '@/types/response/Role';
import { User } from '@/types/response/User';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { changeRoles, getRoles } from '@/query/role';

type Props = {
  user: User;
};

export default function UserManagementCard({ user }: Props) {
  return (
    <div className="flex w-full items-center justify-between gap-2 bg-card px-4 py-2">
      <div className="flex space-x-2">
        <UserAvatar user={user} />
        <CopyButton data={user.id} variant="ghost" content={user.id}>
          <h3>{user.name}</h3>
        </CopyButton>
      </div>
      <ChangeRoleDialog user={user} />
    </div>
  );
}

type DialogProps = {
  user: User;
};

function ChangeRoleDialog({ user: { id, roles, name } }: DialogProps) {
  const axios = useClientAPI();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRoles] = useState<Role[]>(roles);
  const { highestRole } = useMe();
  const [isChanged, setIsChanged] = useState(false);
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { data } = useQuery({
    queryFn: () => getRoles(axios),
    queryKey: ['roles'],
    placeholderData: [],
  });

  const { mutate } = useMutation({
    mutationFn: async (roleIds: number[]) =>
      changeRoles(axios, { userId: id, roleIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-management'],
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
      setSelectedRoles(roles);
    },
    mutationKey: ['updateRole', id],
  });

  function handleRoleChange(value: string[]) {
    const role = value
      .map((v) => data?.find((r) => r.name === v))
      .filter((r) => r) as any as Role[];

    setSelectedRoles(role);
    setIsChanged(true);
  }

  function handleOpenChange(value: boolean) {
    if (value === false && isChanged) {
      mutate(selectedRole.map((r) => r.id));
    }
    setOpen(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <section className="space-x-1">
          {selectedRole.length ? (
            selectedRole.map((role) => (
              <span key={role.id} className={cn(role.color)}>
                {role.name}
              </span>
            ))
          ) : (
            <span>Add role</span>
          )}
        </section>
      </DialogTrigger>
      <DialogContent className="p-6">
        <DialogTitle>Change Role for {name}</DialogTitle>
        <DialogDescription></DialogDescription>
        <ToggleGroup
          className="grid grid-cols-2"
          type={'multiple'}
          onValueChange={handleRoleChange}
          defaultValue={roles.map((r) => r.name)}
        >
          {data
            ?.filter((r) => r.position < highestRole || highestRole === 32767)
            .map((role) => (
              <ToggleGroupItem
                className="justify-start space-x-2 px-0 capitalize hover:bg-transparent"
                key={role.id}
                value={role.name}
              >
                <span key={role.id} className={cn(role.color)}>
                  {role.name}
                </span>
                {selectedRole.map((r) => r.id).includes(role.id) ? (
                  <CheckSquare className="size-5" />
                ) : (
                  <Square className="size-5" />
                )}
              </ToggleGroupItem>
            ))}
        </ToggleGroup>
      </DialogContent>
    </Dialog>
  );
}
