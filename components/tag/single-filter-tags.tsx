import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import TagGroup from '@/types/response/TagGroup';

type SingeFilerTagsProps = {
  group: TagGroup;
  selectedValue: string;
  handleTagGroupChange: (value: string) => void;
};

export default function SingeFilerTags({
  group,
  selectedValue,
  handleTagGroupChange,
}: SingeFilerTagsProps) {
  return (
    <ToggleGroup
      className="flex w-full flex-wrap justify-start"
      type={'single'}
      value={selectedValue}
      onValueChange={handleTagGroupChange}
    >
      <span
        className="whitespace-nowrap text-lg capitalize"
        style={{ color: group.color }}
      >
        {group.name}
      </span>
      <Separator className="border-[1px]" orientation="horizontal" />
      {group.value.map((value, index) => (
        <ToggleGroupItem className="capitalize" key={index} value={value}>
          {value}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
