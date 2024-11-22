import { type Node } from 'reactflow';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Logic page' },
    position: { x: 100, y: 100 },
  },
  {
    id: '2',
    data: { label: 'In development' },
    type: 'default',
    position: { x: 100, y: 200 },
  },
  {
    id: '3',
    data: { label: 'Set', value: 'result = 0' },
    type: 'textUpdater',
    position: { x: 300, y: 100 },
  },
  {
    id: '4',
    data: { label: 'Jump -> 6', value: 'if result == 0 { goto 6 }' },
    type: 'textUpdater',
    position: { x: 300, y: 250 },
  },
  {
    id: '5',
    data: { label: 'Set', value: 'set result = 5' },
    type: 'textUpdater',
    position: { x: 150, y: 400 },
  },
  {
    id: '6',
    data: { label: 'Print', value: 'result' },
    type: 'textUpdater',
    position: { x: 450, y: 400 },
  },
  {
    id: '7',
    data: {},
    type: 'setNode',
    position: { x: 100, y: 500 },
  },
];

const nodes = initialNodes.map((node) => ({
  ...node,
  data: {
    ...node.data,
    id: node.id,
  },
}));

export default nodes;
