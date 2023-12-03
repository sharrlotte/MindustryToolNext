import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

type NoResultProps = HTMLAttributes<HTMLDivElement>;

export default function NoResult({ className }: NoResultProps) {
  return <div className={cn(className)}>No result</div>;
}
