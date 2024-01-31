import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { HTMLAttributes } from 'react';

type RejectButtonProps = HTMLAttributes<HTMLButtonElement>;

export default function RejectButton({
  className,
  ...props
}: RejectButtonProps) {
  return (
    <Button
      className={cn('aspect-square p-2', className)}
      variant="outline"
      title="Reject"
      {...props}
    >
      <XMarkIcon className="h-5 w-5" />
    </Button>
  );
}
