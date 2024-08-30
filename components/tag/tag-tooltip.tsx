import Tran from '@/components/common/tran';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React, { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
  name: string;
  value: string;
  children: ReactNode;
};

function _TagTooltip({ name, value, children }: Props) {
  return (
    <ErrorBoundary fallback={<span>{children}</span>}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{children}</span>
        </TooltipTrigger>
        <TooltipContent className="bg-foreground normal-case text-background">
          <Tran text={`tag.${name}.${value}.description`} />
        </TooltipContent>
      </Tooltip>
    </ErrorBoundary>
  );
}

const TagTooltip = React.memo(_TagTooltip);
export default TagTooltip;
