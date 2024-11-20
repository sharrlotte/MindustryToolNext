'use client';

import { useCallback, useState } from 'react';
import ReactFlow, { Background, Controls, EdgeChange, MiniMap, NodeChange, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

import TextUpdaterNode from './TextUpdaterNode';
import initialEdges from './edge';
import initialNodes from './nodes';

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

export default function Page() {
  return <Flow />;
}

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodeChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);

  const onEdgeChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds) as any), [setEdges]);

  const onEdgeConnect = useCallback((x: any) => setEdges((eds) => addEdge({ ...x, animated: true }, eds) as any), [setEdges]);

  return (
    <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodeChange} nodeTypes={nodeTypes} onEdgesChange={onEdgeChange} onConnect={onEdgeConnect}>
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}
