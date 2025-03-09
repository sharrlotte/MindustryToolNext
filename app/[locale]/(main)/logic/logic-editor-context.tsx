import { createContext, useContext } from 'react';

import { Edge, Node } from '@xyflow/react';

export const LogicEditorContext = createContext<LogicEditorContextType | null>(null);

type LogicEditorContextType = {
  isDeleteOnClick: boolean;

  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;

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
