import Detail from "@/components/detail/detail";
import LikeComponent from "@/components/like/like-component";
import TagCard from "@/components/tag/TagCard";
import BackButton from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/copy-button";
import conf from "@/constant/global";
import { fixProgressBar } from "@/lib/utils";
import Map from "@/types/Map";
import { Tags } from "@/types/Tag";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import React, { HTMLAttributes } from "react";

type MapDetailProps = HTMLAttributes<HTMLDivElement> & {
  map: Map;
};

export default function MapDetail({ map }: MapDetailProps) {
  const tags = Tags.parseStringArray(map.tags);
  const link = `${conf.baseUrl}/maps/${map.id}`;

  return (
    <Detail>
      <Detail.Info>
        <div className="relative">
          <CopyButton
            className="absolute left-1 top-1 "
            title="Copy"
            variant="ghost"
            data={link}
            content={link}
          />
          <Detail.Image
            src={`${conf.apiUrl}/maps/${map.id}/image`}
            alt={map.name}
          />
        </div>
        <Detail.Header>{map.name}</Detail.Header>
        <Detail.Description>
          <p>{map.description}</p>
          <section className="flex flex-wrap gap-1">
            {tags.map((item, index) => (
              <TagCard key={index} tag={item} />
            ))}
          </section>
        </Detail.Description>
      </Detail.Info>
      <Detail.Actions className="flex justify-between">
        <div className="flex gap-1">
          <Button
            className="aspect-square"
            title="Download"
            size="icon"
            variant="outline"
            asChild
          >
            <a
              href={`${conf.apiUrl}/maps/${map.id}/download`}
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
              className="aspect-square"
              size="icon"
              variant="outline"
              title="Like"
            />
            <LikeComponent.LikeCount
              className="aspect-square text-xl"
              size="icon"
              variant="outline"
              title="Like count"
            />
            <LikeComponent.DislikeButton
              className="aspect-square"
              size="icon"
              variant="outline"
              title="Dislike"
            />
          </LikeComponent>
        </div>
        <BackButton />
      </Detail.Actions>
    </Detail>
  );
}
