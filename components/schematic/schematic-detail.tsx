import Detail from "@/components/detail/detail";
import LikeComponent from "@/components/like/like-component";
import TagCard from "@/components/tag/TagCard";
import BackButton from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/ui/copy-button";
import conf from "@/constant/global";
import { toast } from "@/hooks/use-toast";
import { fixProgressBar } from "@/lib/utils";
import axiosClient from "@/query/config/axios-config";
import Schematic from "@/types/Schematic";
import { Tags } from "@/types/Tag";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import React, { HTMLAttributes } from "react";

type SchematicDetailProps = HTMLAttributes<HTMLDivElement> & {
  schematic: Schematic;
};

export default function SchematicDetail({ schematic }: SchematicDetailProps) {
  const tags = Tags.parseStringArray(schematic.tags);
  const link = `${conf.baseUrl}/schematics/${schematic.id}`;

  const getSchematicData = async () => {
    const { dismiss } = toast({
      title: "Coping",
      content: "Downloading data from server",
    });
    const result = await axiosClient.get(`/schematics/${schematic.id}/data`);
    dismiss();
    return result.data as Promise<string>;
  };

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
            src={`${conf.apiUrl}/schematics/${schematic.id}/image`}
            alt={schematic.name}
          />
        </div>
        <Detail.Description>
          <Detail.Header>{schematic.name}</Detail.Header>
          <p>{schematic.description}</p>
          <section className="flex flex-wrap gap-1">
            {tags.map((item, index) => (
              <TagCard key={index} tag={item} />
            ))}
          </section>
        </Detail.Description>
      </Detail.Info>
      <Detail.Actions className="flex justify-between">
        <div className="flex gap-1">
          <CopyButton
            title="Copy"
            variant="outline"
            content={`Copied schematic ${schematic.name}`}
            data={getSchematicData}
          />
          <Button
            className="aspect-square"
            title="Download"
            size="icon"
            variant="outline"
            asChild
          >
            <a
              href={`${conf.apiUrl}/schematics/${schematic.id}/download`}
              download
              onClick={fixProgressBar}
            >
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
        </div>
        <BackButton />
      </Detail.Actions>
    </Detail>
  );
}
