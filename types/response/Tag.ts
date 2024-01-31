import { TAG_DEFAULT_COLOR, TAG_SEPARATOR } from '@/constant/constant';
import TagGroup from '@/types/response/TagGroup';

type Tag = {
  name: string;
  value: string;
  color: string;
};

export default Tag;

export class Tags {
  static parseString(str: string) {
    const [name, value] = str.split(TAG_SEPARATOR);
    if (!name || !value) throw new Error(`Invalid tag: ${str}`);

    return { name, value, color: TAG_DEFAULT_COLOR };
  }

  static parseStringArray(arr: string[]) {
    const result = [];
    for (let tag of arr) {
      try {
        result.push(Tags.parseString(tag));
      } catch (err) {
        console.error(err);
      }
    }
    return result;
  }

  static fromTagGroup(tags: TagGroup[]): Tag[] {
    return tags.flatMap((group) =>
      group.value.map((v) => {
        return {
          name: group.name,
          value: v,
          color: group.color,
        };
      }),
    );
  }

  static toString(tags: Tag[]) {
    return tags.map((tag) => tag.name + TAG_SEPARATOR + tag.value).join();
  }
}
