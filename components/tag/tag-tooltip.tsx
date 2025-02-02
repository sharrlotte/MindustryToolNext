import React, { ReactNode } from 'react';

import Tran from '@/components/common/tran';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
  value: string;
  children: ReactNode;
};

function TagTooltip({ value, children }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex gap-1">{children}</span>
        </TooltipTrigger>
        <TooltipContent className="bg-foreground normal-case text-background">
          <Tran text={`tags.${value}.description`} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default TagTooltip;
