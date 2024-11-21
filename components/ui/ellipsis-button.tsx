import React from 'react';

import { EllipsisIcon } from '@/components/common/icons';
import { Button, ButtonProps } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils';

type Props = Pick<ButtonProps, 'variant' | 'children' | 'className'>;

const EllipsisButton = ({ className, variant, children, ...props }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={cn('bg-transparent p-0', className)} variant={variant} type="button" {...props}>
          <EllipsisIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="gap-1 p-1 text-sm font-light grid">{children}</PopoverContent>
    </Popover>
  );
};

export { EllipsisButton };
