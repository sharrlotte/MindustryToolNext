import { useLogicEditor } from '@/app/[locale]/(main)/logic/logic-editor-context';

import { Connection, Handle, useNodeConnections } from '@xyflow/react';

export function OutputHandle(props: Parameters<typeof Handle>[0] & { label: string }) {
  const { setEdges } = useLogicEditor();
  const connections = useNodeConnections({
    handleType: props.type,
    handleId: props.id ?? '',
    onConnect(connections: Connection[]) {
      setEdges((prevEdges) => prevEdges.map((edge) => (edge.id === (connections[0] as unknown as any).edgeId ? { ...edge, label: props.label } : edge)));
    },
  });

  return <Handle {...props} id={props.id} isConnectable={connections.length < 1} />;
}
