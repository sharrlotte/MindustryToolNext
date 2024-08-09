import _ from 'lodash';

import { TAG_DEFAULT_COLOR, TAG_SEPARATOR } from '@/constant/constant';
import { Tags } from '@/types/response/Tag';

type TagGroup = {
  name: string;
  values: string[];
  color: string;
  duplicate: boolean;
};

export default TagGroup;

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
    return Tags.fromTagGroup(tags).map(
      (tag) => tag.name + TAG_SEPARATOR + tag.value,
    );
  }

  static parseString(tagsString: string[], tags: TagGroup[]) {
    const tagsArray =
      tagsString
        ?.map((value) => value.split(TAG_SEPARATOR))
        .filter((value) => value.length === 2)
        .map((value) => ({ name: value[0], value: value[1] })) ?? [];

    const tagGroup = Object.entries(
      Object.groupBy(tagsArray, ({ name }) => name),
    )
      .map(
        ([key, value]) =>
          [
            key,
            value as {
              name: string;
              value: string;
            }[],
          ] as const,
      )
      .map(([key, value]) => ({
        name: key,
        values:
          value
            .values()
            .map(({ value }) => value)
            .toArray() ?? [],
      }))
      .map((tag) => {
        if (tags.length === 0) {
          return { ...tag, color: TAG_DEFAULT_COLOR, duplicate: true };
        }

        const result = tags.find(
          (t) =>
            t.name === tag.name &&
            tag.values.every((b) => tag.values.includes(b)),
        );
        // Ignore tag that not match with server
        if (result) {
          result.values = [...tag.values];
        }

        return result;
      })
      .filter((value) => !!value);

    return tagGroup;
  }
}
