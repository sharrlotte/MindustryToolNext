import Tran from '@/components/common/tran';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React, { ReactNode } from 'react';

type Props = {
  value: string;
  children: ReactNode;
};

function InternalTagTooltip({ value, children }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className='flex'>{children}</span>
        </TooltipTrigger>
        <TooltipContent className="bg-foreground normal-case text-background">
          <Tran text={`tags.${value}.description`} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const TagTooltip = React.memo(InternalTagTooltip);
export default TagTooltip;
