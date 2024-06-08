import { cn } from '@/lib/utils';

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-70',
  {
    variants: {
      variant: {
        default:
          'text-primary-foreground shadow bg-background border border-border',
        primary: 'bg-button dark:text-foreground text-background',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-opacity-90',
        outline:
          'border border-border bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary dark:border shadow-md text-secondary-foreground dark:border-border',
        ghost: 'text-background dark:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        icon: 'p-0',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-7 w-7 aspect-square',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    title: string;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, title, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        title={title}
        ref={ref}
        type="button"
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
