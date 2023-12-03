import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import SortTag from "@/types/response/SortTag";
import TagGroup from "@/types/response/TagGroup";

type SortTagProps = {
  filter: string;
  selectedSortTag: SortTag;
  tag: TagGroup;
  handleSortChange: (value: string) => void;
};

export default function SortTags({
  filter,
  selectedSortTag,
  tag,
  handleSortChange,
}: SortTagProps) {
  let filteredSortTags = tag.value;
  if (!tag.name.includes(filter)) {
    filteredSortTags = tag.value.filter((tag) => tag.includes(filter));
    if (filteredSortTags.length === 0) {
      return null;
    }
  }

  return (
    <ToggleGroup
      className="flex w-full flex-wrap justify-start"
      type={'single'}
      value={selectedSortTag}
      onValueChange={handleSortChange}
    >
      <span className="whitespace-nowrap text-lg capitalize">Sort</span>
      <Separator className="border-[1px]" orientation="horizontal" />
      {filteredSortTags.map((value, index) => (
        <ToggleGroupItem className="capitalize" key={index} value={value}>
          {value}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
