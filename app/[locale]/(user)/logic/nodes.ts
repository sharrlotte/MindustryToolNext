interface Node {
  id: string;
  type?: string;
  data: { label: string };
  position: { x: number; y: number };
}

const nodes: Node[] = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Logic page' },
    position: { x: 500, y: 100 },
  },
  {
    id: '2',
    data: { label: 'In development' },
    type: 'default',
    position: { x: 500, y: 200 },
  },
];

export default nodes;
