'use client';

import { useCallback, useState } from 'react';
import ReactFlow, { Background, Controls, EdgeChange, MiniMap, NodeChange, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

import { SmartBezierEdge } from '@tisoap/react-flow-smart-edge';

import initialEdges from './edge/edge';
import TextUpdaterNode from './nodes/TextUpdaterNode';
import initialNodes from './nodes/nodes';

// type Props = {
//   params: Promise<{
//     locale: Locale;
//   }>;
// };
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { locale } = await params;
//   const title = await translate(locale, 'logic');

//   return {
//     title: formatTitle(title),
//   };
// }

const nodeTypes = {
  textUpdater: TextUpdaterNode,
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
