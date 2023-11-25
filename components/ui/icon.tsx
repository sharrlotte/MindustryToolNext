import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import IconPath from "@/constant/icons";

type IconProps = {
  className?: string;
  path: IconPath;
  alt?: string;
};

export default function Icon({ className, path, alt }: IconProps) {
  return (
    <Image
      className={cn(className)}
      src={path}
      alt={alt ?? path}
      width={16}
      height={16}
    />
  );
}
