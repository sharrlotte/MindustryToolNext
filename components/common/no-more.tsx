import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

type NoMoreProps = HTMLAttributes<HTMLDivElement>;

export default function NoMore({ className }: NoMoreProps) {
  return <div className={cn(className)}>No more</div>;
}
