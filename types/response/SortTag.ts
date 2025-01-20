import TagGroup from '@/types/response/TagGroup';

export const sortTag = ['time_desc', 'time_asc', 'like_desc', 'download_count_desc'] as const;

type SortTag = (typeof sortTag)[number];

export const sortTagGroup: TagGroup = {
  name: 'sort',
  values: sortTag.map((v) => ({ name: v })),
  color: 'green',
  duplicate: false,
};

export default SortTag;
