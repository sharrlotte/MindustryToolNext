import { TAG_DEFAULT_COLOR, TAG_SEPARATOR } from '@/constant/constant';
import { groupBy } from '@/lib/utils';
import { Tags } from '@/types/response/Tag';

type TagGroup = {
  name: string;
  values: {
    name: string;
    icon?: string;
  }[];
  color: string;
  duplicate: boolean;
};

export default TagGroup;

export type TagGroupDto = {
  id: number;
  name: string;
  description: string;
  categories: TagCategoryDto[];
};

export type TagCategoryDto = {
  id: number;
  name: string;
  color: string;
  duplicate: boolean;
};

export type AllTagGroup = {
  schematic: TagGroup[];
  map: TagGroup[];
  post: TagGroup[];
  plugin: TagGroup[];
};

export class TagGroups {
  static toString(tags: TagGroup[]) {
    return Tags.toString(Tags.fromTagGroup(tags));
  }
  static toStringArray(tags: TagGroup[]) {
    return Tags.fromTagGroup(tags).map((tag) => tag.name + TAG_SEPARATOR + tag.value);
  }

  static parseString(str: string[], tags: TagGroup[]): TagGroup[] {
    const tagsArray =
      str
        .filter(Boolean) //
        ?.map((value) => value.split(TAG_SEPARATOR))
        .filter((value) => value.length === 2)
        .map((value) => ({ name: value[0], value: value[1] })) ?? [];

    const tagGroup = groupBy(tagsArray, ({ name }) => name)
      .map(({ key, value }) => ({
        name: key,
        values: value.map(({ value }) => ({ name: value })) ?? [],
      }))
      .map((tag) => {
        if (tags.length === 0) {
          return { ...tag, color: TAG_DEFAULT_COLOR, duplicate: true };
        }

        const result = tags.find((t) => t.name === tag.name && tag.values.every((b) => tag.values.includes(b)));
        // Ignore tag that not match with server
        if (result) {
          const r = { ...result, values: tag.values };
          return r;
        }
      })
      .filter((value) => !!value);

    return tagGroup;
  }
}
