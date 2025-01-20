import React, { useState } from 'react';

import { PlusIcon } from '@/components/common/icons';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { createGroupInfo, getTagCategories } from '@/query/tag';
import { TagGroupDto } from '@/types/response/TagGroup';

import { useMutation, useQuery } from '@tanstack/react-query';

type Props = {
  group: TagGroupDto;
};
export default function CreateGroupInfoPopover({ group }: Props) {
  const axios = useClientApi();
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['tag-category'],
    queryFn: () => getTagCategories(axios),
  });

  const { invalidateByKey } = useQueriesData();
  const { mutate } = useMutation({
    mutationFn: (categoryId: number) => createGroupInfo(axios, group.id, categoryId),
    mutationKey: ['group-info'],
    onSuccess: () => {
      toast.success(<Tran text="upload.success" />);
    },
    onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error.message }),
    onSettled: () => {
      invalidateByKey(['tag-category']);
      invalidateByKey(['tag-group']);
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="p-2 bg-secondary rounded-lg border">
        <PlusIcon />
      </PopoverTrigger>
      <PopoverContent className="p-6">
        <ScrollContainer className="grid gap-1">
          {data
            ?.filter((category) => !group.categories.map((value) => value.id).includes(category.id))
            .map((category) => (
              <Button
                className="border bg-secondary p-2"
                key={category.id}
                onClick={() => {
                  mutate(category.id);
                  setOpen(false);
                }}
              >
                <Tran text={`tags.${category.name}`} />
              </Button>
            ))}
        </ScrollContainer>
      </PopoverContent>
    </Popover>
  );
}
