"use client";

import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

type SearchProps = HTMLAttributes<HTMLDivElement>;

function Search({ className, children, ...props }: SearchProps) {
  return (
    <div
      className={cn(
        "flex gap-2 rounded-md border-[1px] border-border px-2 justify-center items-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type InputProps = HTMLAttributes<HTMLInputElement> & {
  placeholder: string
};

function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-full w-full bg-transparent hover:outline-none focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

Search.Input = Input;
Search.Icon = SearchIcon;

export default Search;
