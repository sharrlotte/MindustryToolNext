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
  const result: TagGroup[] = tags1.map((v) => ({ ...v, values: [...v.values] }));

  tags2.forEach((value) => {
    const group = result.find((v) => v.name === value.name);

    if (group) {
      group.values = group.values.concat(value.values);
    } else {
      result.push({ ...value, values: [...value.values] });
    }
  });

  return result;
}
