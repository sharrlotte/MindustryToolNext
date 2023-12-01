import React, { HTMLAttributes } from "react";
import Preview from "@/components/preview/preview";
import Map from "@/types/response/Map";
import env from "@/constant/env";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn, fixProgressBar } from "@/lib/utils";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import LikeComponent from "@/components/like/like-component";
import CopyButton from "@/components/ui/copy-button";

type MapPreviewProps = HTMLAttributes<HTMLDivElement> & {
  map: Map;
};

export default function MapPreview({
  className,
  map,
  ...rest
}: MapPreviewProps) {
  const link = `${env.url.base}/maps/${map.id}`;

  return (
    <Preview className={cn("relative flex flex-col", className)} {...rest}>
      <CopyButton
        className="absolute left-1 top-1 "
        title="Copy"
        variant="ghost"
        data={link}
        content={link}
      />
      <Link href={`/maps/${map.id}`}>
        <Preview.Image
          className="h-preview w-preview"
          src={`${env.url.api}/maps/${map.id}/image`}
          alt={map.name}
        />
      </Link>
      <Preview.Description>
        <Preview.Header className="h-12">{map.name}</Preview.Header>
        <Preview.Actions>
          <Button title="Download" size="icon" variant="outline" asChild>
            <a
              href={`${env.url.api}/maps/${map.id}/download`}
              download
              onClick={fixProgressBar}
            >
              <ArrowDownTrayIcon className="h-6 w-6" />
            </a>
          </Button>
          <LikeComponent
            initialLikeCount={map.like}
            initialLikeData={map.userLike}
          >
            <LikeComponent.LikeButton
              size="icon"
              variant="outline"
              title="Like"
            />
            <LikeComponent.LikeCount
              className="text-xl"
              size="icon"
              variant="outline"
              title="Like count"
            />
            <LikeComponent.DislikeButton
              size="icon"
              variant="outline"
              title="Dislike"
            />
          </LikeComponent>
        </Preview.Actions>
      </Preview.Description>
    </Preview>
  );
}
