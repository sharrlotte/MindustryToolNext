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

import { useLogicEditor } from '@/app/[locale]/(user)/logic/logic-editor-context';

import ComboBox from '@/components/common/combo-box';

import { uuid } from '@/lib/utils';

import { Connection, Handle, Position, useNodeConnections } from '@xyflow/react';

type LabelItem = {
  label: string;
  condition?: (state: Record<string, string | number>) => boolean;
};

type InputItem = {
  label?: string;
  input: string;
  defaultValue?: string;
  condition?: (state: Record<string, string | number>) => boolean;
};

type OptionItem = {
  name: string;
  options: string[];
};

type NodeItem = LabelItem | InputItem | OptionItem;

type Output = {
  type: string;
  label: string;
  value: any;
};

export class NodeData {
  id = uuid();
  name: string;
  label: string;
  color: string;
  items: NodeItem[];
  inputs: number;
  outputs: Output[];
  compile: () => string;

  constructor({ name, label, color, items, inputs, outputs, compile }: { name: string; label: string; color: string; items: NodeItem[]; inputs: number; outputs: Output[]; compile: () => string }) {
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
        defaultValue: 'a',
        condition: (state) => state['condition'] !== 'always',
      },
      {
        name: 'condition',
        options: ['>', '>=', '<', '<=', '==', '===', 'not', 'always'],
      },
      {
        input: 'b',
        defaultValue: 'b',
        condition: (state) => state['condition'] !== 'always',
      },
    ],
    inputs: 1,
    outputs: [
      { type: 'boolean', label: 'True', value: null },
      { type: 'boolean', label: 'False', value: null },
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
        defaultValue: 'result',
        input: 'result',
      },
      {
        label: '=',
        defaultValue: 'cell1',
        input: 'cell',
      },
      {
        label: 'at',
        defaultValue: '0',
        input: 'position',
      },
    ],
    inputs: 1,
    outputs: [{ type: 'boolean', label: 'Next', value: true }],
    compile: () => 'if (condition) { return b; }',
  }),
  write: new NodeData({
    name: 'write',
    label: 'write',
    color: '#A08A8A',
    items: [
      {
        label: 'Write',
        defaultValue: 'result',
        input: 'result',
      },
      {
        label: 'to',
        defaultValue: 'cell1',
        input: 'cell',
      },
      {
        label: 'at',
        defaultValue: '0',
        input: 'position',
      },
    ],
    inputs: 1,
    outputs: [{ type: 'boolean', label: 'Next', value: null }],
    compile: () => 'if (condition) { return b; }',
  }),
};

function OutputHandle(props: Parameters<typeof Handle>[0] & { label: string }) {
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

export function MlogNode({ data }: Node) {
  const type = useMemo(() => new NodeData(nodes[data.type]), [data]);
  const [state, setState] = useState(type.getDefaultState());
  const { id, label, color, inputs, outputs, items } = type;

  return (
    <div className="custom-node p-1.5 rounded-sm text-white w-[440px]" style={{ backgroundColor: color }}>
      {Array(inputs)
        .fill(1)
        .map((_, i) => (
          <Handle style={{ marginLeft: 20 * i - ((inputs - 1) / 2) * 20 + 'px' }} key={i} type={'target'} position={Position.Top} isConnectable={true} />
        ))}
      {outputs.map((output, i) => (
        <OutputHandle id={`${id}-source-handle-${i}`} style={{ marginLeft: 20 * i - ((outputs.length - 1) / 2) * 20 + 'px' }} label={output.label} key={i} type={'source'} position={Position.Bottom} />
      ))}
      <span className="text-sm font-bold">{label}</span>
      <div className="bg-black p-2 rounded-sm flex gap-1 items-end jus flex-wrap">
        {items.map((item, i) => (
          <NodeItem key={i} color={color} data={item} state={state} setState={setState} />
        ))}
      </div>
    </div>
  );
}

export function NodeItem({ color, data, state, setState }: { color: string; state: Record<string, string | number>; setState: (data: Record<string, string | number>) => void; data: NodeItem }) {
  if ('input' in data && (data.condition ? data.condition(state) : true)) {
    return (
      <div className="flex gap-1 w-40">
        {data.label && <span className="border-transparent border-b-[3px]">{data.label}</span>}
        <input
          className="bg-transparent border-b-[3px] px-2 hover min-w-20 max-w-40 sm:max-w-80 focus:outline-none" //
          style={{ borderColor: color }}
          type="text"
          value={state[data.input] ?? data.defaultValue ?? ''}
          onChange={(e) => setState({ ...state, [data.input]: e.target.value })}
        />
      </div>
    );
  }

  if ('options' in data) {
    return (
      <div className="bg-transparent border-b-[3px] flex items-end" style={{ borderColor: color }}>
        <ComboBox
          className="bg-transparent px-2 py-0 text-center w-fit font-bold border-none items-end justify-end"
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

  if ('label' in data && (data.condition ? data.condition(state) : true)) {
    return <span className="border-transparent border-b-[3px]">{data.label}</span>;
  }
}

export const nodeOptions = [
  {
    label: 'Input/Output',
    items: [
      { type: 'read', label: 'Read' },
      { type: 'write', label: 'Write' },
      { type: 'draw', label: 'Draw' },
      { type: 'print', label: 'Print' },
    ],
  },
  {
    label: 'Block Control',
    items: [
      { type: 'draw-flush', label: 'Draw flush' },
      { type: 'print-flush', label: 'Print flush' },
      { type: 'get-link', label: 'Get link' },
      { type: 'control', label: 'Control' },
      { type: 'radar', label: 'Radar' },
      { type: 'sensor', label: 'Sensor' },
    ],
  },
  {
    label: 'Operation',
    items: [
      { type: 'set', label: 'Set' },
      { type: 'operation', label: 'Operation' },
      { type: 'look-up', label: 'Look up' },
      { type: 'pack-color', label: 'Pack color' },
    ],
  },
  {
    label: 'Flow Control',
    items: [
      { type: 'wait', label: 'Wait' },
      { type: 'stop', label: 'Stop' },
      { type: 'end', label: 'End' },
      { type: 'jump', label: 'Jump' },
    ],
  },
  {
    label: 'Unit Control',
    items: [
      { type: 'unit-bind', label: 'Unit bind' },
      { type: 'unit-control', label: 'Unit control' },
      { type: 'unit-radar', label: 'Unit radar' },
      { type: 'unit-locate', label: 'Unit locate' },
    ],
  },
];
