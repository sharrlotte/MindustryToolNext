// Compile -> Turn node to instruction
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
import { groupBy, uuid } from '@/lib/utils';

export type ItemsType = Readonly<NodeItem[]>;

export type ConditionFn<T extends ItemsType> = {
  [K in Extract<T[number], { name: string }>['name']]?: (state: InferStateType<T>) => boolean;
};

type LabelItem<T extends string = string> = {
  type: 'label';
  value: T;
};

type InputItem<T extends string = string, N extends string = string> = {
  type: 'input';
  label?: string;
  name: N;
  value: T;
};

type OptionItem<T extends string = string, N extends string = string> = {
  type: 'option';
  name: N;
  options: T[];
};

export type NodeItem = LabelItem | InputItem | OptionItem;

type Output = {
  type: string;
  label: string;
  value: any;
};

export type InferStateType<T extends ItemsType> = {
  [K in Extract<T[number], { name: string }>['name']]: Extract<T[number], { name: K; value: any }>['value'];
};

type CompileFn<T extends ItemsType> = (state: InferStateType<T>) => string;

export class NodeData<T extends ItemsType = ItemsType> {
  id = uuid();
  name: string;
  category: string;
  label: string;
  color: string;
  items: Readonly<T>;
  inputs: number;
  outputs: Output[];
  compile: CompileFn<T>;
  condition?: ConditionFn<T>;

  constructor({
    name,
    label,
    condition,
    category,
    color,
    items,
    inputs,
    outputs,
    compile,
  }: {
    name: string;
    category: string;
    label: string;
    color: string;
    items: T;
    inputs: number;
    outputs: Output[];
    compile: CompileFn<T>;
    condition?: ConditionFn<T>;
  }) {
    this.name = name;
    this.label = label;
    this.category = category;
    this.color = color;
    this.items = items;
    this.inputs = inputs;
    this.outputs = outputs;
    this.compile = compile;
    this.condition = condition;
  }

  getDefaultState(): InferStateType<typeof this.items> {
    let state = {};

    for (const item of this.items) {
      if (item.type === 'option') {
        state = { ...state, [item.name]: item.options[0] };
      } else if (item.type === 'input') {
        state = { ...state, [item.name]: item.value ?? '' };
      }
    }

    return state as any;
  }
}

export type InstructionNodeData<T extends (keyof typeof nodes)[number] = (keyof typeof nodes)[number]> = {
  data: { type: T; index?: number; node: NodeData; state: InferStateType<(typeof nodes)[T]['items']> };
  isConnectable?: boolean;
};

export const nodes: Record<string, NodeData> = {
  start: new NodeData({
    name: 'start',
    label: 'Start',
    color: 'green',
    category: 'Special',
    items: [],
    inputs: 0,
    outputs: [{ type: 'boolean', label: '', value: true }],
    compile: () => '',
  }),

  end: new NodeData({
    name: 'end',
    label: 'End',
    color: 'blue',
    category: 'Special',
    items: [],
    inputs: 1,
    outputs: [],
    compile: () => '',
  }),
  if: new NodeData({
    name: 'if',
    label: 'Jump',
    category: 'Flow Control',
    color: '#6BB2B2',
    items: [
      {
        type: 'label',
        value: 'If',
      },
      {
        type: 'input',
        name: 'a',
        value: 'a',
      },
      {
        type: 'option',
        name: 'condition',
        options: ['>', '>=', '<', '<=', '==', '===', 'not', 'always'],
      },
      {
        type: 'input',
        name: 'b',
        value: 'b',
      },
    ] as const,
    inputs: 1,
    outputs: [
      { type: 'boolean', label: 'True', value: null },
      { type: 'boolean', label: 'False', value: null },
    ],
    compile: (state) => `jump ${1} ${state.condition} ${state.a} ${state.b}`,
    condition: {
      a: (state) => state.condition !== 'always',
      b: (state) => state.condition !== 'always',
    },
  }),
  read: new NodeData({
    name: 'read',
    label: 'read',
    category: 'Input/Output',
    color: '#A08A8A',
    items: [
      {
        type: 'input',
        label: 'Read',
        name: 'result',
        value: 'result',
      },
      {
        type: 'input',
        label: '=',
        value: 'cell1',
        name: 'cell',
      },
      {
        label: 'at',
        value: '0',
        name: 'position',
        type: 'input',
      },
    ],
    inputs: 1,
    outputs: [],
    compile: () => 'if (condition) { return b; }',
  }),
};

export const nodeOptions = groupBy(Object.values(nodes), (p) => p.category).map(({ key, value }) => {
  return {
    label: key,
    items: value.map((p) => ({ type: p.name, label: p.label })),
  };
});
