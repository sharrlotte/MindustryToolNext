type TagGroup = {
  name: string;
  value: string[];
  color: string;
  duplicate: boolean;
};

export default TagGroup;

export type AllTagGroup = {
  schematic: TagGroup[];
  map: TagGroup[];
  post: TagGroup[];
};
