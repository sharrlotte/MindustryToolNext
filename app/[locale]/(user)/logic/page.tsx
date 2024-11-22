'use client';

import { useCallback, useState } from 'react';
import ReactFlow, { Background, Controls, EdgeChange, MiniMap, NodeChange, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
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

const edgeTypes = {
  smart: SmartBezierEdge,
};

export default function Page() {
  return <Flow />;
}

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodeChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);

  const onEdgeChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds) as any), [setEdges]);

  const onEdgeConnect = useCallback((params: any) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'smart' }, eds) as any), [setEdges]);

  return (
    <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodeChange} nodeTypes={nodeTypes} edgeTypes={edgeTypes} onEdgesChange={onEdgeChange} onConnect={onEdgeConnect}>
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}
