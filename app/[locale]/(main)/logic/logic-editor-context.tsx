import { createContext, useCallback, useContext, useState } from 'react';

import HelperLines from '@/app/[locale]/(main)/logic/helper-lines';
import InstructionNodeComponent, { InstructionNode } from '@/app/[locale]/(main)/logic/instruction.node';
import { getHelperLines } from '@/app/[locale]/(main)/logic/utils';

import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import { Edge, EdgeChange, NodeChange, ProOptions, ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges, useReactFlow } from '@xyflow/react';
import { InferStateType, ItemsType, NodeData } from '@/app/[locale]/(main)/logic/node';
import { groupBy } from '@/lib/utils';


export const nodeTypes = {
  instruction: InstructionNodeComponent,
} as const;

export type NodeType = keyof typeof nodeTypes;
export type Node = InstructionNode

const LogicEditorContext = createContext<LogicEditorContextType | null>(null);


export const instructionNodes: Record<string, NodeData> = {
  start: new NodeData({
    name: 'start',
    label: 'Start',
    color: '#6BB2B2',
    category: 'Special',
    items: [],
    inputs: 0,
    compile: () => '',
  }),

  end: new NodeData({
    name: 'end',
    label: 'End',
    color: '#6BB2B2',
    category: 'Special',
    items: [],
    inputs: 1,
    outputs: [],
    compile: () => '',
  }),
  if: new NodeData({
    name: 'if',
    label: 'Jump',
    category: 'Flow Control',
    color: '#6BB2B2',
    items: [
      {
        type: 'label',
        value: 'If',
      },
      {
        type: 'input',
        name: 'a',
        value: 'a',
      },
      {
        type: 'option',
        name: 'condition',
        options: ['>', '>=', '<', '<=', '==', '===', 'not', 'always'],
      },
      {
        type: 'input',
        name: 'b',
        value: 'b',
      },
    ] as const,
    inputs: 1,
    outputs: [
      { label: 'True', },
      { label: 'False', },
    ] as const,
    compile: ({ state, next }) => `jump ${next.True?.data.index ?? 0} ${state.condition} ${state.a} ${state.b}`,
    condition: {
      a: (state) => state.condition !== 'always',
      b: (state) => state.condition !== 'always',
    },
  }),
  read: new NodeData({
    name: 'read',
    label: 'read',
    category: 'Input/Output',
    color: '#A08A8A',
    items: [
      {
        type: 'input',
        label: 'Read',
        name: 'result',
        value: 'result',
      },
      {
        type: 'input',
        label: '=',
        value: 'cell1',
        name: 'cell',
      },
      {
        label: 'at',
        value: '0',
        name: 'position',
        type: 'input',
      },
    ] as const,
    inputs: 1,
    compile: ({ state }) => `read ${state.result} ${state.cell} ${state.position}`,
  }),
} as const;

export const nodeOptions = groupBy(Object.values(instructionNodes), (p) => p.category).map(({ key, value }) => {
  return {
    label: key,
    items: value.map((p) => ({ type: p.name, label: p.label })),
  };
});


const initialNodes: Node[] = [
  {
    id: '7',
    data: {
      type: 'start',
      node: instructionNodes.start,
      state: instructionNodes.start.getDefaultState()
    },
    type: 'instruction',
    position: { x: 450, y: 500 },
  },
];

type LogicEditorContextType = {
  isDeleteOnClick: boolean;

  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;

  setNodeState: (id: string, fn: (prev: InferStateType<ItemsType>) => InferStateType<ItemsType>) => void

  actions: {
    undo: () => void;
    redo: () => void;
    addNode: (type: string) => void;
    toggleDeleteOnClick: () => void;
  };
};

export const useLogicEditor = () => {
  const context = useContext(LogicEditorContext);

  if (!context) {
    throw new Error('useLogicEditor must be used within a LogicEditorProvider');
  }

  return context;
};

const proOptions: ProOptions = { hideAttribution: true };

export function LogicEditorProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(initialNodes.length + 1);
  const [helperLineHorizontal, setHelperLineHorizontal] = useState<number | undefined>(undefined);
  const [helperLineVertical, setHelperLineVertical] = useState<number | undefined>(undefined);

  const [nodeHistory, setNodeHistory] = useState<Node[][]>([initialNodes]);
  const [edgeHistory, setEdgeHistory] = useState<Edge[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isDeleteOnClick, setDeleteOnClick] = useState(false);

  const { screenToFlowPosition } = useReactFlow();

  const updateHistory = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      const newHistoryIndex = historyIndex + 1;
      setNodeHistory((prev) => [...prev.slice(0, newHistoryIndex), newNodes]);
      setEdgeHistory((prev) => [...prev.slice(0, newHistoryIndex), newEdges]);
      setHistoryIndex(newHistoryIndex);
    },
    [historyIndex],
  );

  const findNode = useCallback((type: string) => nodes.find((node) => node.type === 'instruction' && node.data.type === type), [nodes]);

  const setNodeState = useCallback((id: string, fn: (prev: InferStateType<ItemsType>) => InferStateType<ItemsType>) => {
    const node = nodes.find((node) => node.id === id);

    if (node) {
      const newNode = { ...node, data: { ...node.data, state: fn(node.data.state) } };
      const newNodes = nodes.map((n) => (n.id === id ? newNode : n));
      setNodes(newNodes);
    }
  }, [nodes, setNodes])


  const addNode = useCallback(
    (type: string) => {
      const position = screenToFlowPosition({ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 200 });
      if (type === 'start') {
        const target = findNode('start');
        if (target) {
          toast.error(<Tran text="logic.only-one-start" />);
          return;
        }
      }
      const newNode: Node = {
        id: `${nodeIdCounter}`,
        type: 'instruction',
        data: { type, node: instructionNodes[type], state: instructionNodes[type].getDefaultState() },
        position,
      };
      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      setNodeIdCounter((prev) => prev + 1);
      updateHistory(newNodes, edges);
    },
    [screenToFlowPosition, nodeIdCounter, nodes, updateHistory, edges, findNode],
  );

  const customApplyNodeChanges = useCallback((changes: NodeChange[], nodes: Node[]): Node[] => {
    setHelperLineHorizontal(undefined);
    setHelperLineVertical(undefined);

    if (changes.length === 1 && changes[0].type === 'position' && changes[0].dragging && changes[0].position) {
      const helperLines = getHelperLines(changes[0], nodes);

      changes[0].position.x = helperLines.snapPosition.x ?? changes[0].position.x;
      changes[0].position.y = helperLines.snapPosition.y ?? changes[0].position.y;

      setHelperLineHorizontal(helperLines.horizontal);
      setHelperLineVertical(helperLines.vertical);
    }

    return applyNodeChanges(changes, nodes) as unknown as any;
  }, []);

  const onNodeChange = useCallback(
    (changes: NodeChange[]) => {
      const newNodes = customApplyNodeChanges(changes, nodes);
      setNodes(newNodes);
    },
    [customApplyNodeChanges, nodes],
  );

  const onEdgeChange = useCallback(
    (changes: EdgeChange[]) => {
      const newEdges = applyEdgeChanges(changes, edges);
      setEdges(newEdges);
      updateHistory(nodes, newEdges);
    },
    [edges, updateHistory, nodes],
  );

  const onEdgeConnect = useCallback(
    (params: any) => {
      const newEdges = addEdge({ ...params, animated: true }, edges);
      setEdges(newEdges);
      updateHistory(nodes, newEdges);
    },
    [edges, updateHistory, nodes],
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      const newNodes = nodes.filter((node) => !deleted.some((d) => d.id === node.id));
      const newEdges = edges.filter((edge) => !deleted.some((d) => d.id === edge.source || d.id === edge.target));
      setNodes(newNodes);
      setEdges(newEdges);
      updateHistory(newNodes, newEdges);
    },
    [nodes, edges, updateHistory],
  );

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      const newEdges = edges.filter((edge) => !deleted.some((d) => d.id === edge.id));
      setEdges(newEdges);
      updateHistory(nodes, newEdges);
    },
    [edges, updateHistory, nodes],
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (isDeleteOnClick) {
        const newNodes = nodes.filter((n) => n.id !== node.id);
        const newEdges = edges.filter((e) => e.source !== node.id && e.target !== node.id);
        setNodes(newNodes);
        setEdges(newEdges);
        updateHistory(newNodes, newEdges);
      }
    },
    [isDeleteOnClick, nodes, edges, updateHistory],
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      if (isDeleteOnClick) {
        const newEdges = edges.filter((e) => e.id !== edge.id);
        setEdges(newEdges);
        updateHistory(nodes, newEdges);
      }
    },
    [isDeleteOnClick, edges, updateHistory, nodes],
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      if (!isDeleteOnClick) {
        const newNodes = nodes.filter((n) => n.id !== node.id);
        const newEdges = edges.filter((e) => e.source !== node.id && e.target !== node.id);
        setNodes(newNodes);
        setEdges(newEdges);
        updateHistory(newNodes, newEdges);
      }
    },
    [isDeleteOnClick, nodes, edges, updateHistory],
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      if (!isDeleteOnClick) {
        const newEdges = edges.filter((e) => e.id !== edge.id);
        setEdges(newEdges);
        updateHistory(nodes, newEdges);
      }
    },
    [isDeleteOnClick, edges, updateHistory, nodes],
  );

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const newNodes = nodes.map((n) => (n.id === node.id ? { ...n, position: node.position } : n));
      setNodes(newNodes);
      updateHistory(newNodes, edges);
    },
    [nodes, updateHistory, edges],
  );

  const undo = () => {
    if (historyIndex > 0) {
      const newHistoryIndex = historyIndex - 1;
      setNodes(nodeHistory[newHistoryIndex]);
      setEdges(edgeHistory[newHistoryIndex]);
      setHistoryIndex(newHistoryIndex);
    }
  };

  const redo = () => {
    if (historyIndex < nodeHistory.length - 1) {
      const newHistoryIndex = historyIndex + 1;
      setNodes(nodeHistory[newHistoryIndex]);
      setEdges(edgeHistory[newHistoryIndex]);
      setHistoryIndex(newHistoryIndex);
    }
  };
  return (
    <LogicEditorContext.Provider value={{ edges, nodes, setEdges, setNodes, setNodeState, isDeleteOnClick, actions: { redo, undo, addNode, toggleDeleteOnClick: () => setDeleteOnClick((prev) => !prev) } }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodeChange}
        onEdgesChange={onEdgeChange}
        onConnect={onEdgeConnect}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onNodeDragStop={onNodeDragStop}
        proOptions={proOptions}
        fitView
      >
        {children}
        <HelperLines horizontal={helperLineHorizontal} vertical={helperLineVertical} />
      </ReactFlow>
    </LogicEditorContext.Provider>
  );
}
