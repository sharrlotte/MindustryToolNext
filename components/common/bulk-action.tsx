import { SquareCheckedIcon, SquareIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { ReactNode, useCallback, useState } from 'react';

type ContextType = {
  show: boolean;
  setShow: (value: boolean) => void;
  value: string[];
  onSelect: (value: string) => void;
  onDelete: (value: string[]) => void;
};

const defaultContextValue: ContextType = {
  show: false,
  setShow: () => {},
  value: [],
  onSelect: () => {},
  onDelete: () => {},
};

const context = React.createContext(defaultContextValue);

export function useBulkAction() {
  const c = React.useContext(context);

  if (!c) {
    throw new Error('Can not use out side of context');
  }

  return c;
}

type BulkActionProps = {
  onDelete: (value: string[]) => void;
  children: ReactNode;
};

export function BulkActionContainer({ onDelete, children }: BulkActionProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [show, setShow] = useState(false);

  const onSelect = useCallback((value: string) => {
    setSelected((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }

      return [...prev, value];
    });
  }, []);

  return (
    <context.Provider
      value={{ show, value: selected, onSelect, setShow, onDelete }}
    >
      {children}
    </context.Provider>
  );
}

export function BulkDeleteToggle() {
  const { show, setShow, value, onDelete } = useBulkAction();

  if (value.length > 0) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="secondary">
            <Tran text="selected" args={{ number: value.length }} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <Tran text="are-you-sure" />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <Tran text="selected" args={{ number: value.length }} />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Tran text="cancel" />
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive"
              asChild
            >
              <Button onClick={() => onDelete(value)}>
                <Tran text="delete" />
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button variant="secondary" onClick={() => setShow(!show)}>
      <Tran text="bulk-delete" />
    </Button>
  );
}

type BulkActionSelectorProps = {
  className?: string;
  value: string;
  children?: ReactNode;
};

export function BulkActionSelector({
  className,
  value,
  children,
}: BulkActionSelectorProps) {
  const { show, value: selected, onSelect } = useBulkAction();
  const isSelected = selected.includes(value);

  if (!show) {
    return undefined;
  }

  return (
    <Button
      className={cn('absolute right-1 top-1', className)}
      variant="icon"
      size="icon"
      onClick={() => onSelect(value)}
    >
      {children || (isSelected ? <SquareCheckedIcon /> : <SquareIcon />)}
    </Button>
  );
}
