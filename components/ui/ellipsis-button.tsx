import React from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

type Props = Pick<ButtonProps, 'variant' | 'children' | 'className'>;

const EllipsisButton = ({ className, variant, children, ...props }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(className, 'p-0 bg-transparent')}
          variant={variant}
          type="button"
          {...props}
        >
          <EllipsisHorizontalIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-1 p-1 text-sm font-light">
        {children}
      </PopoverContent>
    </Popover>
  );
};

export { EllipsisButton };
