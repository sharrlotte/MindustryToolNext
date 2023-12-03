import TagGroup from '@/types/response/TagGroup';

export const sortTag = ['time_1', 'time_-1', 'like_1'] as const;
type SortTag = (typeof sortTag)[number];

export const sortTagGroup: TagGroup = {
  name: 'sort',
  value: [...sortTag],
  color: 'green',
  duplicate: false,
};

export default SortTag;
