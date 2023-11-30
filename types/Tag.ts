type Tag = {
  name: string;
  value: string;
  color: string;
};

export default Tag;

export const TAG_DEFAULT_COLOR = "green";
export const TAG_SEPARATOR = "_";

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
        console.log(err);
      }
    }
    return result;
  }
}
