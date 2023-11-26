import React, { HTMLAttributes } from "react";
import Preview from "@/components/preview/preview";
import Schematic from "@/types/Schematic";
import cfg from "@/constant/global";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import LikeComponent from "@/components/like/like-component";

type SchematicPreviewProps = HTMLAttributes<HTMLDivElement> & {
  schematic: Schematic;
};

export default function SchematicPreview({
  className,
  schematic,
  ...rest
}: SchematicPreviewProps) {
  const { toast } = useToast();

  return (
    <Preview className={cn("relative flex flex-col", className)} {...rest}>
      <Button
        className="absolute left-1 top-1 aspect-square p-2"
        title="Copy link"
        variant="ghost"
      >
        <Copy className="h-4 w-4" strokeWidth="1.3px" />
      </Button>
      <Link href={`/schematics/${schematic.id}`}>
        <Preview.Image
          className="h-preview w-preview"
          src={`${cfg.apiUrl}/schematics/${schematic.id}/image`}
          alt={schematic.name}
        />
      </Link>
      <Preview.Description>
        <Preview.Header className="h-12">{schematic.name}</Preview.Header>
        <Preview.Actions>
          <Button
            className="aspect-square"
            size="icon"
            variant="outline"
            title="Copy"
            onClick={() =>
              toast({
                title: "Copied",
              })
            }
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
        </Preview.Actions>
      </Preview.Description>
    </Preview>
  );
}
