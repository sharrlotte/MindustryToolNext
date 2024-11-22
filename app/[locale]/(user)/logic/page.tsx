'use client';

import { useCallback, useState } from 'react';
import ReactFlow, { Background, Controls, Edge, EdgeChange, MiniMap, Node, NodeChange, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

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

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
    },
    [setNodes, setEdges],
  );

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, []);

  return (
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
      onNodeContextMenu={onNodeContextMenu}
      onEdgeContextMenu={onEdgeContextMenu}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}
