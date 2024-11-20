interface Edge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
}

const edges: Edge[] = [{ id: 'el1-2', source: '1', target: '2', animated: true }];

export default edges;
