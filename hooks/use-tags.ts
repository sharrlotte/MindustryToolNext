import { useMemo } from 'react';

import { TagType } from '@/constant/constant';
import useClientApi from '@/hooks/use-client';
import { getTags } from '@/query/tag';
import { Mod } from '@/types/response/Mod';
import TagGroup, { AllTagGroup } from '@/types/response/TagGroup';

import { useQuery } from '@tanstack/react-query';

export default function useTags(type: TagType, mod?: Mod) {
  const axios = useClientApi();
  const { data } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => getTags(axios),
  });

  const { data: mods } = useQuery({
    queryKey: ['tags', mod?.id],
    queryFn: async () => (mod ? getTags(axios, mod.id) : ({} as AllTagGroup)),
  });

  const tags = useMemo(() => merge(validateTags(data, type), validateTags(mods, type)), [data, mods, type]);

  return tags;
}

function validateTags(data: AllTagGroup | undefined, type: TagType) {
  return data && type in data ? data[type].filter((v) => v.values.length > 0) : [];
}

function merge(tags1: TagGroup[], tags2: TagGroup[]): TagGroup[] {
  tags2.forEach((value) => {
    const group = tags1.find((v) => v.name === value.name);

    if (group) {
      group.values.concat(value.values);
    } else {
      tags1.push(value);
    }
  });

  return tags1;
}
