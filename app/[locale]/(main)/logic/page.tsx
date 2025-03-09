'use client';

import { motion } from 'framer-motion';
import { Eraser, HelpCircle, Pencil, Redo2, Undo2 } from 'lucide-react';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import React from 'react';

import HelperLines from '@/app/[locale]/(main)/logic/helper-lines';
import { LogicEditorContext, useLogicEditor } from '@/app/[locale]/(main)/logic/logic-editor-context';
import { initialNodes, nodeOptions } from '@/app/[locale]/(main)/logic/node';
import { nodeTypes } from '@/app/[locale]/(main)/logic/node-type';

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';

import { Background, Controls, Edge, EdgeChange, MiniMap, Node, NodeChange, ProOptions, ReactFlow, ReactFlowProvider, addEdge, applyEdgeChanges, applyNodeChanges, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import './style.css';
import { getHelperLines } from './utils';

const proOptions: ProOptions = { hideAttribution: true };

export default function Page() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

function Flow() {
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

  const findNode = useCallback((type: string) => nodes.find((node) => node.type === 'mlog' && node.data.type === type), [nodes]);

  const addNode = useCallback(
    (type: string, label: string) => {
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
        type: 'mlog',
        data: { label, id: nodeIdCounter, type },
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

    return applyNodeChanges(changes, nodes);
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
    <ReactFlowProvider>
      <LogicEditorContext.Provider value={{ edges, nodes, setEdges, setNodes, isDeleteOnClick, redo, undo, addNode, toggleDeleteOnClick: () => setDeleteOnClick((prev) => !prev) }}>
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
          <LiveCodePanel />
          <TopLeftMenu />
          <MiniMap />
          <Controls />
          <Background />
          <HelperLines horizontal={helperLineHorizontal} vertical={helperLineVertical} />
        </ReactFlow>
      </LogicEditorContext.Provider>
    </ReactFlowProvider>
  );
}

function LiveCodePanel() {
  const { nodes, edges } = useLogicEditor();
  const [show, setShow] = useState(false);
  const code = useMemo(() => {
    const lines: string[] = [];
    let index = 0;
    const start = nodes.find((node) => node.type === 'mlog' && node.data.type === 'start');
    if (!start) {
      return lines;
    }
    const startEdge = edges.find((edge) => edge.source === start.id);

    if (!startEdge) {
      return lines;
    }

    let nextNode = nodes.find((node) => node.type === 'mlog' && node.id === startEdge.target);

    if (!nextNode) {
      return lines;
    }

    function findNextNode(node: Node) {
      const edge = edges.find((edge) => edge.source === node.id);
      if (!edge) return undefined;
      const nextNode = nodes.find((node) => node.type === 'mlog' && node.id === edge.target);
      return nextNode;
    }

    while (nextNode) {
      lines.push(`${index} ${(nextNode.data.node as any).compile(nextNode.data.state)}`);
      nextNode.data.index = index;
      nextNode = findNextNode(nextNode);
      index++;
    }

    return lines;
  }, [edges, nodes]);

  return (
    <div className="top-0 right-0 absolute z-10 flex items-start gap-2 m-4">
      <button className="bg-white p-2 rounded-md text-black" onClick={() => setShow((prev) => !prev)}>
        {show ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </button>
      <motion.div
        animate={show ? 'open' : 'close'}
        variants={{
          open: {
            width: 'min(100vw,600px)',
          },
          close: {
            width: 0,
          },
        }}
        className="p-2 text-lg rounded-md flex-col flex text-black bg-white h-[calc(100dvh-400px)]"
      >
        {show && (
          <div>
            {code.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
function TopLeftMenu() {
  const { redo, undo, toggleDeleteOnClick } = useLogicEditor();

  return (
    <div className="top-0 left-0 absolute flex-col flex z-10 text-black m-4">
      <MlogEditorButton onClick={toggleDeleteOnClick}>
        <Eraser className="h-4 w-4" strokeWidth={1.5} />
      </MlogEditorButton>
      <AddNodeDialog />
      <MlogEditorButton>
        <HelpCircle className="h-4 w-4" strokeWidth={1.5} />
      </MlogEditorButton>
      <MlogEditorButton onClick={undo}>
        <Undo2 className="h-4 w-4" strokeWidth={1.5} />
      </MlogEditorButton>
      <MlogEditorButton onClick={redo}>
        <Redo2 className="h-4 w-4" strokeWidth={1.5} />
      </MlogEditorButton>
    </div>
  );
}

function AddNodeDialog() {
  const { addNode } = useLogicEditor();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MlogEditorButton>
          <Pencil className="h-4 w-4" strokeWidth={1.5} />
        </MlogEditorButton>
      </DialogTrigger>
      <DialogContent className="p-6 rounded-lg">
        <DialogTitle />
        <DialogDescription />
        {nodeOptions.map((option, index) => (
          <div className="flex flex-col border-b py-2 gap-2" key={index}>
            <p className="text-lg">{option.label}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {option.items.map((item: { type: string; label: string }) => (
                <DialogClose key={item.type} className="cursor-pointer hover:text-slate-500 transition-colors" onClick={() => addNode(item.type, item.label)}>
                  {item.label}
                </DialogClose>
              ))}
            </div>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
}

type MlogEditorButtonProps = {
  onClick?: () => void;
  children: ReactNode;
};

function MlogEditorButton({ onClick, children }: MlogEditorButtonProps) {
  return (
    <button className="bg-white p-[5px] py-[7px] h-[28px] w-[28px] transition-colors hover:bg-[#f4f4f4] border-[#eee] border flex items-center justify-center" onClick={onClick}>
      {children}
    </button>
  );
}
