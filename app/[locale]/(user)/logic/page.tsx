'use client';

import { Eraser, HelpCircle, Pencil, Redo2, Undo2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import ReactFlow, { Background, Controls, Edge, EdgeChange, MiniMap, Node, NodeChange, ProOptions, ReactFlowProvider, addEdge, applyEdgeChanges, applyNodeChanges, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';

import { toast } from '@/components/ui/sonner';

import useToggle from '@/hooks/use-state-toggle';
import Modal from '@/layout/modal';
import { cn } from '@/lib/utils';

import SmartBezierEdge from '@tisoap/react-flow-smart-edge';

import initialEdges from './edge';
import HelperLines from './helper-lines';
import {
  ControlNode,
  DrawFlushNode,
  DrawNode,
  EndNode,
  GetLinkNode,
  JumpNode,
  LookUpNode,
  OperationNode,
  PackColorNode,
  PrintFlushNode,
  PrintNode,
  RadarNode,
  ReadNode,
  SensorNode,
  SetNode,
  StopNode,
  TextUpdaterNode,
  UnitBindNode,
  UnitControlNode,
  UnitLocateNode,
  UnitRadarNode,
  WaitNode,
  WriteNode,
} from './nodes/node-types';
import initialNodes from './nodes/nodes';
import './style.css';
import { getHelperLines } from './utils';

const proOptions: ProOptions = { hideAttribution: true };

const edgeTypes = {
  smart: SmartBezierEdge,
};

const nodeTypes = {
  textUpdater: TextUpdaterNode,
  waitNode: WaitNode,
  stopNode: StopNode,
  endNode: EndNode,
  jumpNode: JumpNode,
  setNode: SetNode,
  operationNode: OperationNode,
  lookUpNode: LookUpNode,
  packColorNode: PackColorNode,
  sensorNode: SensorNode,
  controlNode: ControlNode,
  radarNode: RadarNode,
  printFlushNode: PrintFlushNode,
  drawFlushNode: DrawFlushNode,
  getLinkNode: GetLinkNode,
  unitBindNode: UnitBindNode,
  unitControlNode: UnitControlNode,
  unitRadarNode: UnitRadarNode,
  unitLocateNode: UnitLocateNode,
  readNode: ReadNode,
  writeNode: WriteNode,
  drawNode: DrawNode,
  printNode: PrintNode,
};

export default function Page() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [nodeIdCounter, setNodeIdCounter] = useState(initialNodes.length + 1);
  const [helperLineHorizontal, setHelperLineHorizontal] = useState<number | undefined>(undefined);
  const [helperLineVertical, setHelperLineVertical] = useState<number | undefined>(undefined);

  const [nodeHistory, setNodeHistory] = useState<Node[][]>([initialNodes]);
  const [edgeHistory, setEdgeHistory] = useState<Edge[][]>([initialEdges]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const deleteOnClick = useToggle();
  const modal = useToggle();
  const { project } = useReactFlow();

  const showToast = useCallback((description: string) => {
    toast('Erase mode', { description });
  }, []);

  const addNewNode = useCallback(
    (type: string, label: string) => {
      const position = project({ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 200 });
      const newNode: Node = {
        id: `${nodeIdCounter}`,
        type,
        data: { label, id: nodeIdCounter },
        position,
      };
      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      setNodeIdCounter((prev) => prev + 1);
      updateHistory(newNodes, edges);
    },
    [nodeIdCounter, nodes, edges, project],
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
    [nodes, edges],
  );

  const onEdgeConnect = useCallback(
    (params: any) => {
      const newEdges = addEdge({ ...params, animated: true, type: 'smart' }, edges);
      setEdges(newEdges);
      updateHistory(nodes, newEdges);
    },
    [nodes, edges],
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      const newNodes = nodes.filter((node) => !deleted.some((d) => d.id === node.id));
      const newEdges = edges.filter((edge) => !deleted.some((d) => d.id === edge.source || d.id === edge.target));
      setNodes(newNodes);
      setEdges(newEdges);
      updateHistory(newNodes, newEdges);
    },
    [nodes, edges],
  );

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      const newEdges = edges.filter((edge) => !deleted.some((d) => d.id === edge.id));
      setEdges(newEdges);
      updateHistory(nodes, newEdges);
    },
    [nodes, edges],
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (deleteOnClick.isOpen) {
        const newNodes = nodes.filter((n) => n.id !== node.id);
        const newEdges = edges.filter((e) => e.source !== node.id && e.target !== node.id);
        setNodes(newNodes);
        setEdges(newEdges);
        updateHistory(newNodes, newEdges);
      }
    },
    [deleteOnClick, nodes, edges],
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      if (deleteOnClick.isOpen) {
        const newEdges = edges.filter((e) => e.id !== edge.id);
        setEdges(newEdges);
        updateHistory(nodes, newEdges);
      }
    },
    [deleteOnClick, nodes, edges],
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      if (!deleteOnClick.isOpen) {
        const newNodes = nodes.filter((n) => n.id !== node.id);
        const newEdges = edges.filter((e) => e.source !== node.id && e.target !== node.id);
        setNodes(newNodes);
        setEdges(newEdges);
        updateHistory(newNodes, newEdges);
      }
    },
    [deleteOnClick, nodes, edges],
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      if (!deleteOnClick.isOpen) {
        const newEdges = edges.filter((e) => e.id !== edge.id);
        setEdges(newEdges);
        updateHistory(nodes, newEdges);
      }
    },
    [deleteOnClick, nodes, edges],
  );

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const newNodes = nodes.map((n) => (n.id === node.id ? { ...n, position: node.position } : n));
      setNodes(newNodes);
      updateHistory(newNodes, edges);
    },
    [nodes, edges],
  );

  const updateHistory = (newNodes: Node[], newEdges: Edge[]) => {
    const newHistoryIndex = historyIndex + 1;
    setNodeHistory((prev) => [...prev.slice(0, newHistoryIndex), newNodes]);
    setEdgeHistory((prev) => [...prev.slice(0, newHistoryIndex), newEdges]);
    setHistoryIndex(newHistoryIndex);
  };

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

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);
  const memoizedEdgeTypes = useMemo(() => edgeTypes, []);

  const nodeOptions = [
    {
      label: 'Input/Output',
      items: [
        { type: 'readNode', label: 'Read' },
        { type: 'writeNode', label: 'Write' },
        { type: 'drawNode', label: 'Draw' },
        { type: 'printNode', label: 'Print' },
      ],
    },
    {
      label: 'Block Control',
      items: [
        { type: 'drawFlushNode', label: 'Draw flush' },
        { type: 'printFlushNode', label: 'Print flush' },
        { type: 'getLinkNode', label: 'Get link' },
        { type: 'controlNode', label: 'Control' },
        { type: 'radarNode', label: 'Radar' },
        { type: 'sensorNode', label: 'Sensor' },
      ],
    },
    {
      label: 'Operation',
      items: [
        { type: 'setNode', label: 'Set' },
        { type: 'operationNode', label: 'Operation' },
        { type: 'lookUpNode', label: 'Look up' },
        { type: 'packColorNode', label: 'Pack color' },
      ],
    },
    {
      label: 'Flow Control',
      items: [
        { type: 'waitNode', label: 'Wait' },
        { type: 'stopNode', label: 'Stop' },
        { type: 'endNode', label: 'End' },
        { type: 'jumpNode', label: 'Jump' },
      ],
    },
    {
      label: 'Unit Control',
      items: [
        { type: 'unitBindNode', label: 'Unit bind' },
        { type: 'unitControlNode', label: 'Unit control' },
        { type: 'unitRadarNode', label: 'Unit radar' },
        { type: 'unitLocateNode', label: 'Unit locate' },
      ],
    },
    {
      label: 'Other',
      items: [{ type: 'textUpdater', label: 'Custom Node' }],
    },
  ];

  const modalItems = () => {
    return nodeOptions.map((option, index) => (
      <div className="flex flex-col border-b py-2 gap-2" key={index}>
        <p className="text-lg">{option.label}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {option.items.map((item: { type: string; label: string }) => (
            <div
              key={item.type}
              className="cursor-pointer hover:text-slate-500 transition-colors"
              onClick={() => {
                modal.close();
                addNewNode(item.type, item.label);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="m-3 md:m-[15px] top-0 left-0 absolute flex-col flex z-20 text-black">
        <button
          className={cn('p-[5px] border h-[28px] w-[28px] border-[#eee] hover:bg-[#f4f4f4] border-b-0 transition-colors', deleteOnClick.isOpen ? 'bg-white' : 'bg-slate-200')}
          onClick={() => {
            deleteOnClick.toggle();
            showToast(deleteOnClick.isOpen ? 'Erase mode off' : 'Erase mode on');
          }}
        >
          <Eraser className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <button className="bg-white p-[5px] py-[7px] h-[28px] w-[28px] transition-colors hover:bg-[#f4f4f4] border-[#eee] border flex items-center justify-center" onClick={modal.open}>
          <Pencil className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <button className="bg-white h-[28px] w-[28px] p-[5px] transition-colors hover:bg-[#f4f4f4] border-[#eee] border flex items-center justify-center">
          <HelpCircle className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <button className="bg-white h-[28px] w-[28px] p-[5px] py-[7px] transition-colors hover:bg-[#f4f4f4] border border-[#eee] flex justify-center items-center active:bg-slate-400" onClick={undo}>
          <Undo2 className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <button className="bg-white h-[28px] w-[28px] p-[5px] py-[7px] transition-colors hover:bg-[#f4f4f4] border border-[#eee] flex justify-center </button>items-center active:bg-slate-400" onClick={redo}>
          <Redo2 className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodeChange}
        onEdgesChange={onEdgeChange}
        onConnect={onEdgeConnect}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={memoizedNodeTypes}
        edgeTypes={memoizedEdgeTypes}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onNodeDragStop={onNodeDragStop}
        proOptions={proOptions}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
        <HelperLines horizontal={helperLineHorizontal} vertical={helperLineVertical} />
      </ReactFlow>
      <Modal isOpen={modal.isOpen} onClose={modal.toggle}>
        <div className="p-2 grid grid-cols-2 gap-4 max-h-[80vh] overflow-y-scroll no-scrollbar text-center text-white transition-colors">{modalItems()}</div>
      </Modal>
    </>
  );
}
