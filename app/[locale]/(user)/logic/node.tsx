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
import { useMemo, useState } from 'react';

import ComboBox from '@/components/common/combo-box';

import { uuid } from '@/lib/utils';

import { Handle, Position, useHandleConnections, useNodeConnections } from '@xyflow/react';

type LabelItem = {
  label: string;
  condition?: (state: Record<string, string | number>) => boolean;
};

type InputItem = {
  input: string;
  defaultValue?: string;
  condition?: (state: Record<string, string | number>) => boolean;
};

type OptionItem = {
  name: string;
  options: string[];
};

type NodeItem = LabelItem | InputItem | OptionItem;

export class NodeData {
  id = uuid();
  name: string;
  label: string;
  color: string;
  items: NodeItem[];
  inputs: number;
  outputs: {
    type: string;
    name: string;
    value: any;
  }[];
  compile: () => string;

  constructor({ name, label, color, items, inputs, outputs, compile }: { name: string; label: string; color: string; items: NodeItem[]; inputs: number; outputs: { type: string; name: string; value: any }[]; compile: () => string }) {
    this.name = name;
    this.label = label;
    this.color = color;
    this.items = items;
    this.inputs = inputs;
    this.outputs = outputs;
    this.compile = compile;
  }

  getDefaultState() {
    let state = {};

    for (const item of this.items) {
      if ('options' in item) {
        state = { ...state, [item.name]: item.options[0] };
      } else if ('input' in item) {
        state = { ...state, [item.input]: item.defaultValue ?? '' };
      }
    }

    return state;
  }
}

export type Node = {
  data: { type: keyof typeof nodes };
  isConnectable?: boolean;
};

export const nodes: Record<string, NodeData> = {
  if: new NodeData({
    name: 'if',
    label: 'Jump',
    color: '#6BB2B2',
    items: [
      {
        label: 'If',
      },
      {
        input: 'a',
        condition: (state) => state['condition'] !== 'always',
      },
      {
        name: 'condition',
        options: ['>', '>=', '<', '<=', '==', '===', 'not', 'always'],
      },
      {
        input: 'b',
        condition: (state) => state['condition'] !== 'always',
      },
    ],
    inputs: 1,
    outputs: [
      { type: 'boolean', name: 'Condition', value: null },
      { type: 'boolean', name: 'Condition', value: null },
    ],
    compile: () => 'if (condition) { return b; }',
  }),
  read: new NodeData({
    name: 'read',
    label: 'read',
    color: '#A08A8A',
    items: [
      {
        label: 'Read',
      },
      {
        input: 'result',
      },
      {
        label: '=',
      },
      {
        input: 'cell',
      },
      {
        label: 'at',
      },
      {
        input: 'position',
        defaultValue: '0',
      },
    ],
    inputs: 1,
    outputs: [
      { type: 'boolean', name: 'Condition', value: null },
      { type: 'boolean', name: 'Condition', value: null },
    ],
    compile: () => 'if (condition) { return b; }',
  }),
};

function LimitedHandle(props: Parameters<typeof Handle>[0]) {
  const connections = useNodeConnections({
    handleId: props.id ?? '',
  });

  return (
    <>
      {props.id}
      <Handle {...props} isConnectable={connections.length < 1} />
    </>
  );
}

export function MlogNode({ data }: Node) {
  const type = useMemo(() => new NodeData(nodes[data.type]), [data]);
  const [state, setState] = useState(type.getDefaultState());
  const { id, label, color, inputs, outputs, items } = type;

  return (
    <div className="custom-node p-1.5 rounded-sm text-white min-w-80" style={{ backgroundColor: color }}>
      {Array(inputs)
        .fill(1)
        .map((_, i) => (
          <Handle style={{ marginLeft: 20 * i - ((inputs - 1) / 2) * 20 + 'px' }} key={i} type={'target'} position={Position.Top} isConnectable={true} />
        ))}
      {outputs.map((_, i) => (
        <LimitedHandle id={`${id}-source-handle-${i}`} style={{ marginLeft: 20 * i - ((outputs.length - 1) / 2) * 20 + 'px' }} key={i} type={'source'} position={Position.Bottom} isConnectable={true} />
      ))}
      <span className="text-sm font-bold">{label}</span>
      <div className="bg-black p-2 min-w-40 rounded-sm flex gap-1 items-end">
        {items.map((item, i) => (
          <NodeItem key={i} color={color} data={item} state={state} setState={setState} />
        ))}
      </div>
    </div>
  );
}

export function NodeItem({ color, data, state, setState }: { color: string; state: Record<string, string | number>; setState: (data: Record<string, string | number>) => void; data: NodeItem }) {
  if ('label' in data && (data.condition ? data.condition(state) : true)) {
    return <span className="border-transparent border-b-[3px]">{data.label}</span>;
  }

  if ('input' in data && (data.condition ? data.condition(state) : true)) {
    return (
      <input
        className="bg-transparent border-b-[3px] px-2 hover min-w-20 max-w-40 sm:max-w-80 focus:outline-none" //
        style={{ borderColor: color }}
        type="text"
        value={state[data.input] ?? data.input ?? ''}
        onChange={(e) => setState({ ...state, [data.input]: e.target.value })}
      />
    );
  }

  if ('options' in data) {
    return (
      <div className="bg-transparent border-b-[3px] h-full" style={{ borderColor: color }}>
        <ComboBox
          className="bg-transparent px-2 py-0 text-center w-fit font-bold border-none items-end"
          value={{ value: state[data.name], label: state[data.name].toString() }}
          values={data.options.map((option) => ({ value: option, label: option.toString() }))}
          onChange={(value) => {
            if (value) setState({ ...state, [data.name]: value });
          }}
          searchBar={false}
          chevron={false}
        />
      </div>
    );
  }
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
