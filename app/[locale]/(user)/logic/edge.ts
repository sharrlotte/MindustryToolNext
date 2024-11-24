import { type Edge } from 'reactflow';

const edges: Edge[] = [
  { id: 'el1-2', source: '1', target: '2', animated: true, type: 'smart' },
  { id: 'el3-4', source: '3', target: '4', animated: true, type: 'smart' },
  { id: 'el4-5', source: '4', target: '5', animated: true, label: 'false', type: 'smart' },
  { id: 'el4-6', source: '4', target: '6', animated: true, label: 'True', type: 'smart' },
];

export default edges;
