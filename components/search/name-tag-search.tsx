"use client";

import Search from "@/components/search/search-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import TagGroup from "@/types/TagGroup";
import { FilterIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cloneDeep } from "lodash";
import SortTag, { sortTag } from "@/types/SortTag";
import Tag, { TAG_DEFAULT_COLOR, TAG_SEPARATOR } from "@/types/Tag";
import { defaultSortTag } from "@/constant/global";
import { usePathname, useRouter } from "next/navigation";
import useSafeSearchParams from "@/hooks/use-safe-search-params";
import _ from "lodash";
import TagCard from "@/components/tag/TagCard";

type NameTagSearchProps = {
  tags: TagGroup[];
};

let refreshTimeout: NodeJS.Timeout;

export default function NameTagSearch({ tags }: NameTagSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSafeSearchParams();

  const [showFilterDialog, setShowFilterDialog] = useState(false);

  const handleShowFilterDialog = () => setShowFilterDialog(true);
  const handleHideFilterDialog = () => setShowFilterDialog(false);

  const [selectedFilterTags, setSelectedFilterTags] = useState<TagGroup[]>([]);
  const [selectedSortTag, setSelectedSortTag] =
    useState<SortTag>(defaultSortTag);

  const [filter, setFilter] = useState("");

  const tagsClone = cloneDeep(tags);

  useEffect(() => {
    if (tags.length > 0) {
      const sortString = searchParams.get("sort", defaultSortTag) as SortTag;
      const tagsString = searchParams.getAll("tags");

      setSelectedSortTag(sortString);

      const tagsArray = _.chain(tagsString)
        .map((value) => value.split(TAG_SEPARATOR))
        .filter((value) => value.length === 2)
        .map((value) => {
          return { name: value[0], value: value[1] };
        })
        .groupBy((value) => value.name)
        .map((value, key) => ({ name: key, value: value.map((v) => v.value) }))
        .map((tag) => {
          let result = tagsClone.find(
            (t) =>
              t.name === tag.name &&
              tag.value.every((b) => tag.value.includes(b)),
          );
          if (result) {
            result.value = tag.value;
          }

          return result;
        })
        .compact()
        .value();

      setSelectedFilterTags(tagsArray);

      const params = new URLSearchParams();
      selectedFilterTags
        .map((group) =>
          group.value.map((value) => `${group.name}${TAG_SEPARATOR}${value}`),
        )
        .forEach((values) =>
          values.forEach((value) => params.append("tags", value)),
        );

      params.set("sort", selectedSortTag);
    }
  }, [tags]);

  const handleSearch = () => {
    handleSearchQueryChange();
    handleHideFilterDialog();
  };

  const handleSearchQueryChange = () => {
    const params = new URLSearchParams();
    selectedFilterTags
      .map((group) =>
        group.value.map((value) => `${group.name}${TAG_SEPARATOR}${value}`),
      )
      .forEach((values) =>
        values.forEach((value) => params.append("tags", value)),
      );

    params.set("sort", selectedSortTag);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleTagGroupChange = (name: string, value: string[]) => {
    const group = selectedFilterTags.find((tag) => tag.name === name);
    if (group) {
      group.value = value;
    } else {
      let result = tagsClone.find((tag) => tag.name === name);
      if (result) {
        result.value = value;
      } else {
        result = {
          name,
          value,
          color: TAG_DEFAULT_COLOR,
          duplicate: false,
        };
      }
      selectedFilterTags.push(result);
    }
    setSelectedFilterTags([...selectedFilterTags]);
  };

  const handleSortChange = (value: any) => {
    if (value && sortTag.includes(value)) {
      setSelectedSortTag(value);
    }
  };

  const refreshTagDisplay = () => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }

    refreshTimeout = setTimeout(() => handleSearchQueryChange(), 1000);
  };

  const handleDeleteTag = (tag: Tag) => {
    setSelectedFilterTags((prev) => {
      const group = prev.find((item) => item.name === tag.name);
      if (group) {
        group.value = group.value.filter((item) => item !== tag.value);
      }

      return [...prev];
    });
    refreshTagDisplay();
  };

  const filteredTags = tagsClone.filter((tag) => {
    if (tag.name.includes(filter)) {
      return true;
    }
    tag.value = tag.value.filter((value) => value.includes(filter));

    return tag.value.length > 0;
  });

  const displayTags = selectedFilterTags.flatMap((group) =>
    group.value.map((v) => {
      return {
        name: group.name,
        value: v,
        color: group.color,
      };
    }),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-1">
        <Search className="w-full md:w-1/2">
          <Search.Icon className="p-1" />
          <Search.Input placeholder="Search with name" />
        </Search>
        <Button
          title="Filter"
          variant="outline"
          onClick={handleShowFilterDialog}
        >
          <FilterIcon />
        </Button>
      </div>
      <section className="m-auto flex w-full flex-wrap items-center justify-center gap-1 md:w-3/4">
        {displayTags.map((value, index) => (
          <TagCard key={index} tag={value} onDelete={handleDeleteTag} />
        ))}
      </section>
      {showFilterDialog && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <Card className="flex h-full w-full flex-col justify-between gap-2 rounded-none p-4">
            <Search className="w-full p-1">
              <Search.Icon className="p-1" />
              <Search.Input
                placeholder="Search with name"
                onChange={(event) => setFilter(event.currentTarget.value)}
              />
            </Search>
            <CardContent className="no-scrollbar flex h-full w-full flex-col overflow-auto overscroll-none p-0 ">
              <SortTags
                selectedSortTag={selectedSortTag}
                handleSortChange={handleSortChange}
              />
              <FilterTags
                selectedFilterTags={selectedFilterTags}
                filteredTags={filteredTags}
                handleTagGroupChange={handleTagGroupChange}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-1 p-0">
              <Button title="close" onClick={handleHideFilterDialog}>
                Close
              </Button>
              <Button title="search" onClick={handleSearch}>
                Search
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

type SortTagProps = {
  selectedSortTag: SortTag;
  handleSortChange: (value: string) => void;
};

function SortTags({ selectedSortTag, handleSortChange }: SortTagProps) {
  return (
    <ToggleGroup
      className="flex w-full flex-wrap justify-start"
      type={"single"}
      value={selectedSortTag}
      onValueChange={handleSortChange}
    >
      <span className="whitespace-nowrap text-lg capitalize">Sort</span>
      <Separator className="border-[1px]" orientation="horizontal" />
      {sortTag.map((value, index) => (
        <ToggleGroupItem className="capitalize" key={index} value={value}>
          {value}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

type FilterTagProps = {
  selectedFilterTags: TagGroup[];
  filteredTags: TagGroup[];
  handleTagGroupChange: (group: string, value: string[]) => void;
};

function FilterTags({
  selectedFilterTags,
  filteredTags,
  handleTagGroupChange,
}: FilterTagProps) {
  const getSingleValue = (group: TagGroup) => {
    const result = selectedFilterTags.find(
      (value) => value.name === group.name,
    );
    if (result && result.value) {
      return result.value.length > 0 ? result.value[0] : "";
    }
    return "";
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

  return filteredTags.map((group, index) =>
    group.duplicate ? (
      <MultipleFilerTags
        key={index}
        group={group}
        selectedValue={getMultipleValue(group)}
        handleTagGroupChange={(value) =>
          handleTagGroupChange(group.name, value)
        }
      />
    ) : (
      <SingeFilerTags
        key={index}
        group={group}
        selectedValue={getSingleValue(group)}
        handleTagGroupChange={(value) =>
          handleTagGroupChange(group.name, [value])
        }
      />
    ),
  );
}

type SingeFilerTagsProps = {
  group: TagGroup;
  selectedValue: string;
  handleTagGroupChange: (value: string) => void;
};

function SingeFilerTags({
  group,
  selectedValue,
  handleTagGroupChange,
}: SingeFilerTagsProps) {
  return (
    <ToggleGroup
      className="flex w-full flex-wrap justify-start"
      type={"single"}
      value={selectedValue}
      onValueChange={handleTagGroupChange}
    >
      <span className="whitespace-nowrap text-lg capitalize">{group.name}</span>
      <Separator className="border-[1px]" orientation="horizontal" />
      {group.value.map((value, index) => (
        <ToggleGroupItem className="capitalize" key={index} value={value}>
          {value}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

type MultipleFilerTagsProps = {
  group: TagGroup;
  selectedValue: string[];
  handleTagGroupChange: (value: string[]) => void;
};

function MultipleFilerTags({
  group,
  selectedValue,
  handleTagGroupChange,
}: MultipleFilerTagsProps) {
  return (
    <ToggleGroup
      className="flex w-full flex-wrap justify-start"
      type={"multiple"}
      onValueChange={handleTagGroupChange}
      defaultValue={selectedValue}
    >
      <span className="whitespace-nowrap text-lg capitalize">{group.name}</span>
      <Separator className="border-[1px]" orientation="horizontal" />
      {group.value.map((value, index) => (
        <ToggleGroupItem className="capitalize" key={index} value={value}>
          {value}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
