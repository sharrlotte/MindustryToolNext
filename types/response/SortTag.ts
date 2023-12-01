export const sortTag = ["time_1", "time_-1", "like_1"] as const;
type SortTag = (typeof sortTag)[number];

export default SortTag;
