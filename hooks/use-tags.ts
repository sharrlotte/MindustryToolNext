import { TagType } from '@/constant/constant';
import useClientApi from '@/hooks/use-client';
import { getTags } from '@/query/tag';
import { Mod } from '@/types/response/Mod';
import { AllTagGroup } from '@/types/response/TagGroup';

import { useQuery } from '@tanstack/react-query';

export default function useTags(type: TagType, mod?: Mod) {
  const axios = useClientApi();
  const { data } = useQuery({
    queryKey: ['tags', mod?.id],
    queryFn: async () => getTags(axios, mod?.id),
  });

  return validateTags(data, type);
}

function validateTags(data: AllTagGroup | undefined, type: TagType) {
  return data && type in data ? data[type].filter((v) => v.values.length > 0) : [];
}
