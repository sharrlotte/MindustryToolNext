import { TagGroup } from '@/types/response/TagGroup';

export const sortTag = ['time_desc', 'time_asc', 'like_desc', 'download_count_desc'] as const;

type SortTag = (typeof sortTag)[number];

export const sortTagGroup: Omit<TagGroup, 'values'> & { values: { name: string }[] } = {
	name: 'sort',
	values: sortTag.map((v) => ({ name: v })),
	color: 'green',
	duplicate: false,
	position: 0,
};

export default SortTag;
