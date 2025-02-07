import { createContext, useContext } from 'react';

export const LogicEditorContext = createContext<LogicEditorContextType | null>(null);

type LogicEditorContextType = {
  isDeleteOnClick: boolean;

  undo: () => void;
  redo: () => void;
  addNode: (type: string, label: string) => void;
  toggleDeleteOnClick: () => void;
};

export const useLogicEditor = () => {
  const context = useContext(LogicEditorContext);

  if (!context) {
    throw new Error('useLogicEditor must be used within a LogicEditorProvider');
  }

  return context;
};
