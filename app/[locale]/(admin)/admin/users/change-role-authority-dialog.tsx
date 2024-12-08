'use client';

import React, { Fragment, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { SquareCheckedIcon, SquareIcon } from '@/components/common/icons';
import ScrollContainer from '@/components/common/scroll-container';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { revalidate } from '@/action/action';
import { useSession } from '@/context/session-context.client';
import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { groupBy } from '@/lib/utils';
import { changeAuthorities, getAuthorities } from '@/query/authorities';
import { Authority, RoleWithAuthorities } from '@/types/response/Role';

import { useMutation, useQuery } from '@tanstack/react-query';

type Props = {
  role: RoleWithAuthorities;
};

export default function ChangeRoleAuthorityDialog({ role }: Props) {
  const { id: roleId, name, authorities } = role;

  const { session } = useSession();
  const axios = useClientApi();
  const [open, setOpen] = useState(false);
  const [selectedAuthorities, setSelectedAuthorities] = useState<Authority[]>(authorities);

  const [isChanged, setIsChanged] = useState(false);
  const { invalidateByKey } = useQueriesData();

  const { data } = useQuery({
    queryFn: () => getAuthorities(axios),
    queryKey: ['authorities'],
    placeholderData: [],
  });

  const filteredAuthority = useMemo(() => data?.filter((a) => (a.authorityGroup === 'Shar' ? session?.roles.map((r) => r.name).includes('SHAR') : true)) || [], [data, session?.roles]);
  const { mutate } = useMutation({
    mutationFn: async (authorityIds: string[]) => changeAuthorities(axios, { roleId, authorityIds }),
    onSuccess: () => {
      invalidateByKey(['roles']);
      revalidate({ path: '/users' });
    },
    onError: (error) => {
      toast.error('Error', { description: error.message });
      setSelectedAuthorities(authorities);
    },
    mutationKey: ['update-role-authority', roleId],
  });

  function handleAuthorityChange(value: string[]) {
    const authority = value.map((v) => filteredAuthority?.find((r) => r.name === v)).filter((r) => r) as any as Authority[];

    setSelectedAuthorities(authority);
    setIsChanged(true);
  }

  function handleOpenChange(value: boolean) {
    if (value === false && isChanged) {
      mutate(selectedAuthorities.map((r) => r.id));
    }
    setOpen(value);
  }

  const groups = useMemo(() => groupBy(filteredAuthority?.sort((a, b) => a.authorityGroup.localeCompare(b.authorityGroup)) || [], (v) => v.authorityGroup), [filteredAuthority]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="overflow-hidden text-ellipsis">
        <section className="space-x-2">
          {selectedAuthorities.length ? (
            selectedAuthorities.map(({ id, name }) => (
              <span key={id} className="lowercase">
                {name}
              </span>
            ))
          ) : (
            <span>Add authority</span>
          )}
        </section>
      </DialogTrigger>
      <DialogContent className="max-h-full h-full flex flex-col">
        <ScrollContainer className="h-full p-6">
          <DialogTitle>Change authority for {name}</DialogTitle>
          <DialogDescription />
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
        </ScrollContainer>
      </DialogContent>
    </Dialog>
  );
}
