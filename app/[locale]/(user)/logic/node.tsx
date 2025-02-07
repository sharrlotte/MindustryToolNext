// Compile -> Turn node to mlog
// Drag and drop
// Undo, Redo changes
// If else node
// Switch case node
// Node block/Function
// Loops
// Comments node
// Node index
// Save node state to local storage
// Save nodes as function
// Validate nodes
// Autocomplete

type LabelItem = {
  label: string;
};

type NodeItem = LabelItem;

interface NodeData {
  label: string;
  color: string;
  items: NodeItem[];
  inputs: number;
  outputs: {
    type: string;
    name: string;
    value: any;
  }[];
  compile(): string;
}

export type Node = {
  data: NodeData;
  isConnectable?: boolean;
};

const nodes: Node[] = [
  {
    data: {
      label: 'If',
      color: '#E74C3C',
      items: [],
      inputs: 2,
      outputs: [{ type: 'boolean', name: 'Condition', value: null }],
      compile: () => {
        return '';
      },
    },
  },
];

export function MlogNode({ data }: { data: NodeData }) {
  const { label, color, inputs, outputs } = data;

  return (
    <div className="custom-node p-4 rounded-lg text-white" style={{ backgroundColor: color }}>
      <div className="font-bold">{label}</div>
      <div className="flex justify-between mt-2">
        <div className="flex flex-col">
          {[...Array(inputs)].map((_, i) => (
            <div key={`input-${i}`} className="input bg-blue-500 h-4 w-4 rounded-full mb-2"></div>
          ))}
        </div>
        <div className="flex flex-col items-end">
          {[...Array(outputs)].map((_, i) => (
            <div key={`output-${i}`} className="output bg-green-500 h-4 w-4 rounded-full mb-2"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const nodeOptions = [
  {
    label: 'Input/Output',
    items: [
      { type: 'readNode', label: 'Read' },
      { type: 'writeNode', label: 'Write' },
      { type: 'drawNode', label: 'Draw' },
      { type: 'printNode', label: 'Print' },
    ],
  },
  {
    label: 'Block Control',
    items: [
      { type: 'drawFlushNode', label: 'Draw flush' },
      { type: 'printFlushNode', label: 'Print flush' },
      { type: 'getLinkNode', label: 'Get link' },
      { type: 'controlNode', label: 'Control' },
      { type: 'radarNode', label: 'Radar' },
      { type: 'sensorNode', label: 'Sensor' },
    ],
  },
  {
    label: 'Operation',
    items: [
      { type: 'setNode', label: 'Set' },
      { type: 'operationNode', label: 'Operation' },
      { type: 'lookUpNode', label: 'Look up' },
      { type: 'packColorNode', label: 'Pack color' },
    ],
  },
  {
    label: 'Flow Control',
    items: [
      { type: 'waitNode', label: 'Wait' },
      { type: 'stopNode', label: 'Stop' },
      { type: 'endNode', label: 'End' },
      { type: 'jumpNode', label: 'Jump' },
    ],
  },
  {
    label: 'Unit Control',
    items: [
      { type: 'unitBindNode', label: 'Unit bind' },
      { type: 'unitControlNode', label: 'Unit control' },
      { type: 'unitRadarNode', label: 'Unit radar' },
      { type: 'unitLocateNode', label: 'Unit locate' },
    ],
  },
  {
    label: 'Other',
    items: [{ type: 'textUpdater', label: 'Custom Node' }],
  },
];
