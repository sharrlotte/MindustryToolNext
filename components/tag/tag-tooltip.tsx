import Tran from '@/components/common/tran';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React, { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
  value: string;
  children: ReactNode;
};

function _TagTooltip({ value, children }: Props) {
  return (
    <ErrorBoundary fallback={<span>{children}</span>}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{children}</span>
          </TooltipTrigger>
          <TooltipContent className="bg-foreground normal-case text-background">
            <Tran text={`tags.${value}.description`} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </ErrorBoundary>
  );
}

const TagTooltip = React.memo(_TagTooltip);
export default TagTooltip;
