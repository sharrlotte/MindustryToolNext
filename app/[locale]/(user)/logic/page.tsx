'use client';

import { useCallback, useState } from 'react';
import ReactFlow, { Background, Controls, Edge, EdgeChange, MiniMap, Node, NodeChange, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

import useToggle from '@/hooks/use-state-toggle';
import Modal from '@/layout/modal';
import { cn } from '@/lib/utils';

import { SmartBezierEdge } from '@tisoap/react-flow-smart-edge';

import initialEdges from './edge/edge';
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
} from './nodes/TextUpdaterNode';
import initialNodes from './nodes/nodes';

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
  return <Flow />;
}

function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [nodeIdCounter, setNodeIdCounter] = useState(initialNodes.length + 1);

  const deleteOnClick = useToggle();
  const modal = useToggle();

  const addNewNode = () => {
    const newNode: Node = {
      id: `node_${nodeIdCounter}`,
      type: 'textUpdater',
      data: { label: 'Custom Node' },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((prev) => prev + 1);
  };

  const onNodeChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);

  const onEdgeChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);

  const onEdgeConnect = useCallback((params: any) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'smart' }, eds)), [setEdges]);

  const onNodesDelete = useCallback((deleted: Node[]) => {
    setNodes((nds) => nds.filter((node) => !deleted.some((d) => d.id === node.id)));
    setEdges((eds) => eds.filter((edge) => !deleted.some((d) => d.id === edge.source || d.id === edge.target)));
  }, []);

  const onEdgesDelete = useCallback((deleted: Edge[]) => {
    setEdges((eds) => eds.filter((edge) => !deleted.some((d) => d.id === edge.id)));
  }, []);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (deleteOnClick.isOpen) {
        setNodes((nds) => nds.filter((n) => n.id !== node.id));
        setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
      }
    },
    [deleteOnClick],
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      if (deleteOnClick.isOpen) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
    },
    [deleteOnClick],
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      if (!deleteOnClick.isOpen) {
        setNodes((nds) => nds.filter((n) => n.id !== node.id));
        setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
      }
    },
    [deleteOnClick],
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      if (!deleteOnClick.isOpen) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
    },
    [deleteOnClick],
  );

  return (
    <>
      <div className="m-4 top-0 left-0 absolute flex-col flex z-50">
        <button className={cn(' p-[5px] border border-[#eee] border-b-0', deleteOnClick.isOpen ? 'bg-white' : 'bg-slate-200')} onClick={deleteOnClick.toggle}>
          <svg id="icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="h-[16px] w-[16px]">
            <defs>
              <style dangerouslySetInnerHTML={{ __html: '.cls-1{fill:none;}' }} />
            </defs>
            <title />
            <rect height={2} width={23} x={7} y={27} />
            <path
              d="M27.38,10.51,19.45,2.59a2,2,0,0,0-2.83,0l-14,14a2,2,0,0,0,0,2.83L7.13,24h9.59L27.38,13.34A2,2,0,0,0,27.38,10.51ZM15.89,22H8L4,18l6.31-6.31,7.93,7.92Zm3.76-3.76-7.92-7.93L18,4,26,11.93Z"
              transform="translate(0 0)"
            />
            <rect className="cls-1" data-name="<Transparent Rectangle>" height={32} id="_Transparent_Rectangle_" width={32} />
          </svg>
        </button>
        <button className="bg-white p-[5px] py-[7px] border-[#eee] border flex items-center justify-center" onClick={addNewNode}>
          <svg version="1.1" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="h-[12px] w-[12px]">
            <title />
            <desc />
            <defs />
            <g fill="none" fillRule="evenodd" id="Page-1" stroke="none" strokeWidth="{1}">
              <g fill="#000000" id="Core" transform="translate(-213.000000, -129.000000)">
                <g id="create" transform="translate(213.000000, 129.000000)">
                  <path
                    d="M0,14.2 L0,18 L3.8,18 L14.8,6.9 L11,3.1 L0,14.2 L0,14.2 Z M17.7,4 C18.1,3.6 18.1,3 17.7,2.6 L15.4,0.3 C15,-0.1 14.4,-0.1 14,0.3 L12.2,2.1 L16,5.9 L17.7,4 L17.7,4 Z"
                    id="Shape"
                  />
                </g>
              </g>
            </g>
          </svg>
        </button>
      </div>

      {/* <button className="absolute z-50 top-20" onClick={modal.open}>
        Open modal
      </button> */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodeChange}
        onEdgesChange={onEdgeChange}
        onConnect={onEdgeConnect}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(event, node) => onNodeClick(event, node)}
        onEdgeClick={onEdgeClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      <Modal isOpen={modal.isOpen} onClose={modal.toggle}>
        <p>Modal Content</p>
      </Modal>
    </>
  );
}
