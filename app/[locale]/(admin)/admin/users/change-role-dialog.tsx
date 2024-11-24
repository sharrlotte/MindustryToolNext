import { Fragment, useMemo, useState } from 'react';

import { Hidden } from '@/components/common/hidden';
import { SquareCheckedIcon, SquareIcon } from '@/components/common/icons';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Divider from '@/components/ui/divider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { useMe, useSession } from '@/context/session-context.client';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { cn, groupBy } from '@/lib/utils';
import { getAuthorities } from '@/query/authorities';
import { changeRoles, getRoles } from '@/query/role';
import { changeAuthorities } from '@/query/user';
import { Authority, Role } from '@/types/response/Role';
import { User } from '@/types/response/User';

import { useMutation, useQuery } from '@tanstack/react-query';

type DialogProps = {
  user: User;
};

export function ChangeRoleDialog({ user }: DialogProps) {
  const { id, roles, name, authorities } = user;

  const { session } = useSession();
  const { highestRole } = useMe();
  const { invalidateByKey } = useQueriesData();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedRole, setSelectedRoles] = useState<Role[]>(roles);
  const [selectedAuthorities, setSelectedAuthorities] = useState<Authority[]>(authorities);

  const axios = useClientApi();

  const { data: allRoles } = useQuery({
    queryFn: () => getRoles(axios),
    queryKey: ['roles'],
    placeholderData: [],
  });

  const { data: allAuthorities } = useQuery({
    queryFn: () => getAuthorities(axios),
    queryKey: ['authorities'],
    placeholderData: [],
  });

  const bestRole = selectedRole?.sort((o1, o2) => o2.position - o1.position).at(0);
  const filteredRole = allRoles?.filter((r) => r.position < highestRole || session?.roles.map((r) => r.name).includes('SHAR')) || [];

  const filteredAuthority = useMemo(
    () => allAuthorities?.filter((a) => (a.authorityGroup === 'Shar' ? session?.roles.map((r) => r.name).includes('SHAR') : true)) || [],
    [allAuthorities, session?.roles],
  );

  const groups = useMemo(() => groupBy(filteredAuthority?.sort((a, b) => a.authorityGroup.localeCompare(b.authorityGroup)) || [], (v) => v.authorityGroup), [filteredAuthority]);

  const { mutate: updateRole } = useMutation({
    mutationFn: async (roleIds: number[]) => changeRoles(axios, { userId: id, roleIds }),
    onSuccess: () => {
      invalidateByKey(['management']);
    },
    onError: (error) => {
      toast({
        title: 'error',
        variant: 'destructive',
        description: error.message,
      });
      setSelectedRoles(roles);
    },
    mutationKey: ['update-user-role', id],
  });

  const { mutate: updateAuthority } = useMutation({
    mutationFn: async (authorityIds: string[]) => changeAuthorities(axios, { userId: id, authorityIds }),
    onSuccess: () => {
      invalidateByKey(['management']);
    },
    onError: (error) => {
      toast({
        title: 'error',
        variant: 'destructive',
        description: error.message,
      });
      setSelectedAuthorities(authorities);
    },
    mutationKey: ['update-user-authority', id],
  });

  function handleRoleChange(value: string[]) {
    const role = value.map((v) => allRoles?.find((r) => r.name === v)).filter((r) => r) as any as Role[];

    setSelectedRoles(role);
    setIsChanged(true);
  }

  function handleAuthorityChange(value: string[]) {
    const authority = value.map((v) => filteredAuthority?.find((r) => r.name === v)).filter((r) => r) as any as Authority[];

    setSelectedAuthorities(authority);
    setIsChanged(true);
  }

  function handleOpenChange(value: boolean) {
    if (value === false && isChanged) {
      updateRole(selectedRole.map((r) => r.id));
      updateAuthority(selectedAuthorities.map((a) => a.id));
    }
    setOpen(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <section className="flex justify-end gap-1">
          {bestRole ? (
            <span key={bestRole.id} className={cn(bestRole.color)}>
              {bestRole.name}
            </span>
          ) : (
            <span>Add role</span>
          )}
        </section>
      </DialogTrigger>
      <DialogContent className="h-full space-y-2 overflow-y-auto p-6">
        <div className="space-y-2">
          <DialogTitle>Change Role for {name}</DialogTitle>
          <Hidden>
            <DialogDescription />
          </Hidden>
          <Divider />
        </div>
        <ToggleGroup className="grid grid-cols-2" type={'multiple'} onValueChange={handleRoleChange} defaultValue={roles.map((r) => r.name)}>
          {filteredRole.map(({ id, name, color }) => (
            <ToggleGroupItem className="justify-start space-x-2 p-1 px-0 capitalize hover:bg-transparent" key={id} value={name}>
              <span key={id} className={cn(color)}>
                {name}
              </span>
              {selectedRole.map((r) => r.id).includes(id) ? <SquareCheckedIcon /> : <SquareIcon />}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="space-y-2">
          <span className="font-bold">Authority</span>
          <Divider />
        </div>
        <ToggleGroup className="flex flex-col items-start justify-start gap-4" type={'multiple'} onValueChange={handleAuthorityChange} defaultValue={authorities.map((r) => r.name)}>
          {groups.map(({ key, value }) => (
            <Fragment key={key}>
              <span className="font-bold">{key}</span>
              {value.map(({ id, name, description }) => (
                <ToggleGroupItem key={id} className="w-full justify-start space-x-2 p-1 px-0 capitalize hover:bg-transparent data-[state=on]:bg-transparent" value={name}>
                  <div className="w-full space-y-1">
                    <div className="flex w-full justify-between gap-1">
                      <span className="text-sm lowercase">{name}</span>
                      {selectedAuthorities.map((r) => r.id).includes(id) ? <SquareCheckedIcon /> : <SquareIcon />}
                    </div>
                    <p className="text-start text-xs lowercase">{description}</p>
                  </div>
                </ToggleGroupItem>
              ))}
            </Fragment>
          ))}
        </ToggleGroup>
      </DialogContent>
    </Dialog>
  );
}
