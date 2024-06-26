import MultipleFilerTags from '@/components/tag/multiple-filter-tags';
import SingeFilerTags from '@/components/tag/single-filter-tags';
import TagGroup from '@/types/response/TagGroup';

type FilterTagProps = {
  filter: string;
  selectedFilterTags: TagGroup[];
  tags: TagGroup[];
  handleTagGroupChange: (group: string, value: string[]) => void;
};

export default function FilterTags({
  filter,
  tags,
  selectedFilterTags,
  handleTagGroupChange,
}: FilterTagProps) {
  const filteredTags =
    filter.length === 0
      ? tags
      : tags.filter((tag) => {
          if (tag.name.includes(filter)) {
            return true;
          }
          tag.value = tag.value.filter((value) => value.includes(filter));

          return tag.value.length > 0;
        });

  const getSingleValue = (group: TagGroup) => {
    const result = selectedFilterTags.find(
      (value) => value.name === group.name,
    );
    if (result && result.value) {
      return result.value.length > 0 ? result.value[0] : '';
    }
    return '';
  };

  const getMultipleValue = (group: TagGroup) => {
    const result = selectedFilterTags.find(
      (value) => value.name === group.name,
    );
    if (result && result.value) {
      return result.value;
    }
    return [];
  };

  return filteredTags.map((group) =>
    group.duplicate ? (
      <MultipleFilerTags
        key={group.name}
        group={group}
        selectedValue={getMultipleValue(group)}
        handleTagGroupChange={(value) =>
          handleTagGroupChange(group.name, value)
        }
      />
    ) : (
      <SingeFilerTags
        key={group.name}
        group={group}
        selectedValue={getSingleValue(group)}
        handleTagGroupChange={(value) =>
          handleTagGroupChange(group.name, [value])
        }
      />
    ),
  );
}
