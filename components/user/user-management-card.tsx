import React, { useState } from 'react';



import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useMe } from '@/context/session-context';
import useClientAPI from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import changeRoles from '@/query/role/change-role';
import getRoles from '@/query/role/get-roles';
import { Role } from '@/types/response/Role';
import { User } from '@/types/response/User';



import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


type Props = {
  user: User;
};

export default function UserManagementCard({ user }: Props) {
  return (
    <div className="flex gap-2 items-center bg-card py-2 px-4 w-full justify-between">
      <h3>{user.name}</h3>
      <ChangeRoleDialog user={user} />
    </div>
  );
}

type DialogProps = {
  user: User;
};

function ChangeRoleDialog({ user: { id, roles } }: DialogProps) {
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
          {roles.length ? (
            roles.map((role) => (
              <span key={role.id} className={cn(role.color)}>
                {role.name}
              </span>
            ))
          ) : (
            <span>Add role</span>
          )}
        </section>
      </DialogTrigger>
      <DialogContent>
        <ToggleGroup
          className="flex w-full flex-wrap justify-start"
          type={'multiple'}
          onValueChange={handleRoleChange}
          defaultValue={roles.map((r) => r.name)}
        >
          {data
            ?.filter((r) => r.position < highestRole)
            .map((role) => (
              <ToggleGroupItem
                className="capitalize hover:bg-button hover:text-background data-[state=on]:bg-button data-[state=on]:text-background dark:hover:text-foreground data-[state=on]:dark:text-foreground"
                key={role.id}
                value={role.name}
              >
                <span key={role.id} className={cn(role.color)}>
                  {role.name}
                </span>
              </ToggleGroupItem>
            ))}
        </ToggleGroup>
      </DialogContent>
    </Dialog>
  );
}
