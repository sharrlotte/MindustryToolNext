import React from "react";
import Preview from "@/components/preview/preview";
import Schematic from "@/types/Schematic";
import cfg from "@/constant/global";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface SchematicPreviewProps {
  schematic: Schematic;
}

export default function SchematicPreview({ schematic }: SchematicPreviewProps) {
  const { toast } = useToast();

  return (
    <Preview className="relative flex flex-col">
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
            title="Copy"
            size="icon"
            variant="ghost"
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
            variant="ghost"
            asChild
          >
            <a href="\icons\chat.png" download>
              <ArrowDownTrayIcon className="h-6 w-6" />
            </a>
          </Button>
          <Button
            className="aspect-square"
            title="Up vote"
            size="icon"
            variant="ghost"
          >
            <ChevronUpIcon className="h-6 w-6" />
          </Button>
          <Button
            className="aspect-square text-xl"
            size="icon"
            title="Like count"
            variant="ghost"
            disabled
          >
            0
          </Button>
          <Button
            className="aspect-square"
            title="Down vote"
            size="icon"
            variant="ghost"
          >
            <ChevronDownIcon className="h-6 w-6" />
          </Button>
        </Preview.Actions>
      </Preview.Description>
    </Preview>
  );
}
