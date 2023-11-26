import Detail from "@/components/detail/detail";
import LikeComponent from "@/components/like/like-component";
import TagCard from "@/components/tag/TagCard";
import { Button } from "@/components/ui/button";
import conf from "@/constant/global";
import Schematic from "@/types/Schematic";
import { Tags } from "@/types/Tag";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Copy } from "lucide-react";
import React, { HTMLAttributes } from "react";

type SchematicDetailProps = HTMLAttributes<HTMLDivElement> & {
  schematic: Schematic;
};

export default function SchematicDetail({ schematic }: SchematicDetailProps) {
  const tags = Tags.parseStringArray(schematic.tags);

  return (
    <Detail>
      <Button
        className="absolute left-1 top-1 aspect-square p-2"
        title="Copy link"
        variant="ghost"
      >
        <Copy className="h-4 w-4" strokeWidth="1.3px" />
      </Button>
      <Detail.Image
        src={`${conf.apiUrl}/schematics/${schematic.id}/image`}
        alt={schematic.name}
      />
      <Detail.Info>
        <Detail.Description>
          <Detail.Header>{schematic.name}</Detail.Header>
          <p>{schematic.description}</p>
          <section className="flex flex-wrap gap-1">
            {tags.map((item, index) => (
              <TagCard key={index} tag={item} />
            ))}
          </section>
        </Detail.Description>
        <Detail.Actions>
          <Button
            className="aspect-square"
            size="icon"
            variant="outline"
            title="Copy"
          >
            <Copy className="h-6 w-6" strokeWidth="1.3px" />
          </Button>
          <Button
            className="aspect-square"
            title="Download"
            size="icon"
            variant="outline"
            asChild
          >
            <a href="\icons\chat.png" download>
              <ArrowDownTrayIcon className="h-6 w-6" />
            </a>
          </Button>
          <LikeComponent
            initialLikeCount={schematic.like}
            initialLikeData={schematic.userLike}
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
        </Detail.Actions>
      </Detail.Info>
    </Detail>
  );
}
