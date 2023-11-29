import axiosClient from "@/query/config/axios-config";

type TagGroup = {
  name: string;
  value: string[];
  color: string;
  duplicate: boolean;
};

export default TagGroup;

type AllTagGroup = {
  schematic: TagGroup[];
  map: TagGroup[];
  post: TagGroup[];
};

let tagGroups: AllTagGroup;

export class TagGroups {
  static async getTags() {
    if (tagGroups) return tagGroups;

    const { data } = await axiosClient.get("/tags");
    return data as AllTagGroup;
  }
}
