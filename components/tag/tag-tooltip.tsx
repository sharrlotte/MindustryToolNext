import Tran from '@/components/common/tran';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React, { ReactNode } from 'react';

type Props = {
  name: string;
  value: string;
  children: ReactNode;
};

export default function TagTooltip({ name, value, children }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{children}</span>
        </TooltipTrigger>
        <TooltipContent className="bg-foreground normal-case text-background">
          <Tran text={`tag.${name}.${value}.description`} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
