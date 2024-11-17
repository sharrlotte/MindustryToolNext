import { CheckIcon, PencilIcon } from 'lucide-react';
import React, { useState } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';

type ContextType = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const defaultContextValue: ContextType = {
  open: false,
  setOpen: () => {},
};

export const EditorContext = React.createContext<any>(defaultContextValue);

export function useEditor(): ContextType {
  const context = React.useContext(EditorContext);

  if (!context) {
    throw new Error('Can not use out side of context');
  }

  return context;
}

type Props = {
  children: React.ReactNode;
};

export function EditComponent({ children }: Props) {
  const [open, setOpen] = useState(false);

  return <EditorContext.Provider value={{ open, setOpen }}>{children}</EditorContext.Provider>;
}

export function EditTrigger({ children, ...props }: ButtonProps) {
  const { setOpen } = useEditor();

  function handleOpen() {
    setOpen(true);
  }

  return (
    <Button variant="icon" {...props} onClick={handleOpen}>
      {children || <PencilIcon className="size-4" />}
    </Button>
  );
}
export function EditClose({ children, ...props }: ButtonProps) {
  const { setOpen } = useEditor();

  function handleOpen() {
    setOpen(false);
  }

  return (
    <Button variant="icon" {...props} onClick={handleOpen}>
      {children || <CheckIcon className="size-4" />}
    </Button>
  );
}

export function EditOn({ children }: Props) {
  const { open } = useEditor();

  return open ? children : undefined;
}

export function EditOff({ children }: Props) {
  const { open } = useEditor();

  return open ? undefined : children;
}
