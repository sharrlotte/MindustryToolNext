import React, { ReactNode, useCallback, useState } from 'react';

import { SquareCheckedIcon, SquareIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

type ContextType = {
  show: boolean;
  setShow: (value: boolean) => void;
  value: string[];
  onSelect: (value: string) => void;
  onActionCancel: () => void;
  onActionPerform: (value: string[]) => void;
};

const defaultContextValue: ContextType = {
  show: false,
  setShow: () => {},
  value: [],
  onSelect: () => {},
  onActionCancel: () => {},
  onActionPerform: () => {},
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
  onActionPerform: (value: string[]) => void;
  children: ReactNode;
};

export function BulkActionContainer({ onActionPerform, children }: BulkActionProps) {
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

  const handleAction = useCallback(
    (value: string[]) => {
      setSelected([]);
      onActionPerform(value);
    },
    [onActionPerform],
  );

  return (
    <context.Provider
      value={{
        show,
        value: selected,
        onSelect,
        setShow,
        onActionPerform: handleAction,
        onActionCancel: () => setShow(false),
      }}
    >
      {children}
    </context.Provider>
  );
}

export function BulkDeleteToggle() {
  const { show, setShow, value, onActionPerform, onActionCancel } = useBulkAction();

  if (value.length > 0) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="border-none" variant="secondary">
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
            <AlertDialogCancel onClick={onActionCancel}>
              <Tran text="cancel" />
            </AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive" asChild>
              <Button onClick={() => onActionPerform(value)}>
                <Tran text="delete" />
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button className="border-none" variant="secondary" onClick={() => setShow(!show)}>
      <Tran text="bulk-delete" />
    </Button>
  );
}

type BulkActionSelectorProps = {
  className?: string;
  value: string;
  children?: ReactNode;
};

export function BulkActionSelector({ className, value, children }: BulkActionSelectorProps) {
  const { show, value: selected, onSelect } = useBulkAction();
  const isSelected = selected.includes(value);

  if (show)
    return (
      <div className="h-full w-full" onClick={() => onSelect(value)}>
        <div className={cn('h-full w-full', { 'pointer-events-none': show })}>{children}</div>
        <div className={cn('absolute right-1 top-1 size-10 p-0', className, { 'pointer-events-none': show })}>{isSelected ? <SquareCheckedIcon className="size-10" /> : <SquareIcon className="size-10" />}</div>
      </div>
    );

  return children;
}
