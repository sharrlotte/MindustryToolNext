'use server';

import TagGroup, { AllTagGroup } from '@/types/response/TagGroup';

import { getTags } from '@/query/tag';
import axiosInstance from '@/query/config/config';
import { unstable_cache } from 'next/cache';

const getCachedTags = unstable_cache(async () => getTags(axiosInstance), ['tags'], { revalidate: 600 });

const tags = await getCachedTags();

const searchTags: AllTagGroup = {
  schematic: tags.schematic.sort().map((item) => ({ ...item, values: item.values.sort() })),
  map: tags.map.sort().map((item) => ({ ...item, values: item.values.sort() })),
  post: tags.post.sort().map((item) => ({ ...item, values: item.values.sort() })),
  plugin: tags.plugin.sort().map((item) => ({ ...item, values: item.values.sort() })),
};

const predicate = (tag: TagGroup) => tag.name !== 'size';

const uploadTags: AllTagGroup = {
  schematic: tags.schematic.filter(predicate),
  map: tags.map.filter(predicate),
  post: tags.post.filter(predicate),
  plugin: tags.plugin.filter(predicate),
};

export { searchTags, uploadTags };
