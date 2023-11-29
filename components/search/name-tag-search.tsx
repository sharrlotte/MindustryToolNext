"use client";

import Search from "@/components/search/search-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import TagGroup from "@/types/TagGroup";
import { FilterIcon } from "lucide-react";
import React, { useState } from "react";

type NameTagSearchProps = {
  tags: TagGroup[];
};

export default function NameTagSearch({ tags }: NameTagSearchProps) {
  const [showFilterDialog, setShowFilterDialog] = useState(false);

  const handleShowFilterDialog = () => setShowFilterDialog(true);
  const handleHideFilterDialog = () => setShowFilterDialog(false);

  return (
    <div className="flex justify-center gap-1">
      <Search className="w-full md:w-1/2">
        <Search.Icon className="p-1" />
        <Search.Input placeholder="Search with name" />
      </Search>
      <Button title="Filter" variant="outline" onClick={handleShowFilterDialog}>
        <FilterIcon />
      </Button>
      {showFilterDialog && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center overscroll-none backdrop-blur-sm">
          <Card className="flex h-full w-full flex-col justify-between gap-2 rounded-none p-4">
            <Search className="w-full">
              <Search.Icon className="p-1" />
              <Search.Input placeholder="Search with name" />
            </Search>
            <CardTitle></CardTitle>
            <CardContent className="flex h-full w-full flex-col overflow-auto p-0">
              {tags.map((group, index) => {
                return (
                  <ToggleGroup
                    className="flex w-full flex-wrap justify-start"
                    type={group.duplicate ? "multiple" : "single"}
                    key={index}
                  >
                    <span className="whitespace-nowrap text-lg capitalize">
                      {group.name}
                    </span>
                    <Separator
                      className="border-[1px]"
                      orientation="horizontal"
                    />
                    {group.value.map((value, jndex) => {
                      return (
                        <ToggleGroupItem className="capitalize" value={value}>
                          {value}
                        </ToggleGroupItem>
                      );
                    })}
                  </ToggleGroup>
                );
              })}
            </CardContent>
            <CardFooter className="">
              <Button title="close" onClick={handleHideFilterDialog}>
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
