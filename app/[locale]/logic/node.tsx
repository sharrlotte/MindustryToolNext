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
import { InstructionNode } from '@/app/[locale]/logic/instruction.node';

import { groupBy } from '@/lib/utils';

export type ItemsType = Readonly<NodeItem[]>;
export type OutputsType = Readonly<Output[]>;

export type ConditionFn<T extends ItemsType> = {
	[K in Extract<T[number], { name: string }>['name']]?: (state: InferStateType<T>) => boolean;
};

type LabelItem<T extends string = string> = {
	type: 'label';
	value: T;
};

type InputItemAccept = 'number' | 'string' | 'boolean' | 'variable';

export type InputItem<T extends string = string, N extends string = string> = {
	type: 'input';
	label?: string;
	name: N;
	value: T;
	accept: InputItemAccept[];
	produce?: boolean;
};

export type OptionItem<T extends string = string, N extends string = string> = {
	type: 'option';
	name: N;
	options: T[];
};

export type NodeItem = LabelItem | InputItem | OptionItem;

export type Output<T extends string = string> = {
	label: T;
};

export type InferStateType<T extends ItemsType> = {
	[K in Extract<T[number], { name: string }>['name']]: Extract<T[number], { name: K; value: any }>['value'];
};

export type InferNextProps<T extends OutputsType> = {
	[K in T[number]['label']]?: InstructionNode;
};

type CompileFn<T extends ItemsType, O extends OutputsType> = (data: { state: InferStateType<T>; next: InferNextProps<O> }) => string;

export class NodeData<T extends ItemsType = ItemsType, O extends OutputsType = OutputsType> {
	name: string;
	category: string;
	label: string;
	color: string;
	items: Readonly<T>;
	inputs: number;
	outputs: Readonly<O>;
	compile: CompileFn<T, O>;
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
		outputs?: O;
		compile: CompileFn<T, O>;
		condition?: ConditionFn<T>;
	}) {
		this.name = name;
		this.label = label;
		this.category = category;
		this.color = color;
		this.items = items;
		this.inputs = inputs;
		this.outputs =
			outputs ??
			([
				{
					label: '',
				},
			] as unknown as O);
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

type InstructionCategory = 'Special' | 'Input/Output' | 'Flow Control' | 'Block Control' | 'Unit Control' | 'Operations';

export const instructionNodesGraph: Record<string, NodeData | { category: InstructionCategory; label: string; children: Record<string, NodeData> }> = {
	start: new NodeData({
		name: 'start',
		label: 'Start',
		color: '#6BB2B2',
		category: 'Special',
		items: [],
		inputs: 0,
		compile: () => '',
	}),

	end: new NodeData({
		name: 'end',
		label: 'End',
		color: '#6BB2B2',
		category: 'Special',
		items: [],
		inputs: 1,
		outputs: [],
		compile: () => '',
	}),
	read: new NodeData({
		name: 'read',
		label: 'Read',
		category: 'Input/Output',
		color: '#A08A8A',
		items: [
			{
				type: 'input',
				label: 'Read',
				name: 'result',
				value: 'result',
				accept: ['string'],
				produce: true,
			},
			{
				type: 'input',
				label: '=',
				value: 'cell1',
				name: 'cell',
				accept: ['variable', 'string'],
			},
			{
				label: 'at',
				value: '0',
				name: 'position',
				type: 'input',
				accept: ['number', 'variable'],
			},
		] as const,
		inputs: 1,
		compile: ({ state: { result, cell, position } }) => `read ${result} ${cell} ${position}`,
	}),
	write: new NodeData({
		name: 'write',
		label: 'Write',
		category: 'Input/Output',
		color: '#A08A8A',
		items: [
			{
				type: 'input',
				label: 'Write',
				name: 'result',
				value: 'result',
				accept: ['string'],
				produce: true,
			},
			{
				type: 'input',
				label: '=',
				value: 'cell1',
				name: 'cell',
				accept: ['variable', 'string'],
			},
			{
				label: 'at',
				value: '0',
				name: 'position',
				type: 'input',
				accept: ['number', 'variable'],
			},
		] as const,
		inputs: 1,
		compile: ({ state: { result, cell, position } }) => `write ${result} ${cell} ${position}`,
	}),
	print: new NodeData({
		name: 'print',
		label: 'Print',
		category: 'Input/Output',
		color: '#A08A8A',
		items: [
			{
				type: 'input',
				label: 'Print',
				name: 'text',
				value: 'result',
				accept: ['string', 'variable'],
			},
		] as const,
		inputs: 1,
		compile: ({ state }) => `print ${state.text}`,
	}),
	draw: {
		category: 'Input/Output',
		label: 'Draw',
		children: {
			clear: new NodeData({
				name: 'clear',
				label: 'Clear',
				category: 'Input/Output',
				color: '#A08A8A',
				items: [
					{
						type: 'input',
						label: 'r',
						name: 'r',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'g',
						name: 'g',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'b',
						name: 'b',
						value: '0',
						accept: ['number', 'variable'],
					},
				] as const,
				inputs: 1,
				compile: ({ state }) => `draw clear ${state.r} ${state.g} ${state.b} 0 0 0`,
			}),
			color: new NodeData({
				name: 'color',
				label: 'Color',
				category: 'Input/Output',
				color: '#A08A8A',
				items: [
					{
						type: 'input',
						label: 'r',
						name: 'r',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'g',
						name: 'g',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'b',
						name: 'b',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'a',
						name: 'a',
						value: '255',
						accept: ['number', 'variable'],
					},
				] as const,
				inputs: 1,
				compile: ({ state: { r, g, b, a } }) => `draw color ${r} ${g} ${b} ${a} 0 0`,
			}),
			col: new NodeData({
				name: 'col',
				label: 'Col',
				category: 'Input/Output',
				color: '#A08A8A',
				items: [
					{
						type: 'input',
						label: 'color',
						name: 'color',
						value: '0',
						accept: ['number', 'variable'],
					},
				] as const,
				inputs: 1,
				compile: ({ state: { color } }) => `draw col ${color} 0 0 0 0 0`,
			}),
			stroke: new NodeData({
				name: 'stroke',
				label: 'Stroke',
				category: 'Input/Output',
				color: '#A08A8A',
				items: [
					{
						type: 'input',
						label: 'stroke',
						name: 'stroke',
						value: '0',
						accept: ['number', 'variable'],
					},
				] as const,
				inputs: 1,
				compile: ({ state: { stroke } }) => `draw stroke ${stroke} 0 0 0 0 0`,
			}),
			line: new NodeData({
				name: 'line',
				label: 'Line',
				category: 'Input/Output',
				color: '#A08A8A',
				items: [
					{
						type: 'input',
						label: 'x',
						name: 'x',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'y',
						name: 'y',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'x2',
						name: 'x2',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'y2',
						name: 'y2',
						value: '0',
						accept: ['number', 'variable'],
					},
				] as const,
				inputs: 1,
				compile: ({ state: { x, y, x2, y2 } }) => `draw line ${x} ${y} ${x2} ${y2} 0 0`,
			}),
			rect: new NodeData({
				name: 'rect',
				label: 'Rect',
				category: 'Input/Output',
				color: '#A08A8A',
				items: [
					{
						type: 'input',
						label: 'x',
						name: 'x',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'y',
						name: 'y',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'width',
						name: 'width',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'height',
						name: 'height',
						value: '0',
						accept: ['number', 'variable'],
					},
				] as const,
				inputs: 1,
				compile: ({ state: { x, y, width, height } }) => `draw rect ${x} ${y} ${width} ${height} 0 0`,
			}),
			lineRect: new NodeData({
				name: 'lineRect',
				label: 'LineRect',
				category: 'Input/Output',
				color: '#A08A8A',
				items: [
					{
						type: 'input',
						label: 'x',
						name: 'x',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'y',
						name: 'y',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'width',
						name: 'width',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'height',
						name: 'height',
						value: '0',
						accept: ['number', 'variable'],
					},
				] as const,
				inputs: 1,
				compile: ({ state: { x, y, width, height } }) => `draw lineRect ${x} ${y} ${width} ${height} 0 0`,
			}),
			poly: new NodeData({
				name: 'poly',
				label: 'Poly',
				category: 'Input/Output',
				color: '#A08A8A',
				items: [
					{
						type: 'input',
						label: 'x',
						name: 'x',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'y',
						name: 'y',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'sides',
						name: 'sides',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'radius',
						name: 'radius',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'rotation',
						name: 'rotation',
						value: '0',
						accept: ['number', 'variable'],
					},
				] as const,
				inputs: 1,
				compile: ({ state: { x, y, sides, radius, rotation } }) => `draw poly ${x} ${y} ${sides} ${radius} ${rotation} 0`,
			}),
			linePoly: new NodeData({
				name: 'linePoly',
				label: 'LinePoly',
				category: 'Input/Output',
				color: '#A08A8A',
				items: [
					{
						type: 'input',
						label: 'x',
						name: 'x',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'y',
						name: 'y',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'sides',
						name: 'sides',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'radius',
						name: 'radius',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'rotation',
						name: 'rotation',
						value: '0',
						accept: ['number', 'variable'],
					},
				] as const,
				inputs: 1,
				compile: ({ state: { x, y, sides, radius, rotation } }) => `draw linePoly ${x} ${y} ${sides} ${radius} ${rotation} 0`,
			}),
			triangle: new NodeData({
				name: 'triangle',
				label: 'Triangle',
				category: 'Input/Output',
				color: '#A08A8A',
				items: [
					{
						type: 'input',
						label: 'x',
						name: 'x',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'y',
						name: 'y',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'x2',
						name: 'x2',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'y2',
						name: 'y2',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'x3',
						name: 'x3',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'y3',
						name: 'y3',
						value: '0',
						accept: ['number', 'variable'],
					},
				] as const,
				inputs: 1,
				compile: ({ state: { x, y, x2, y2, x3, y3 } }) => `draw triangle ${x} ${y} ${x2} ${y2} ${x3} ${y3}`,
			}),
			image: new NodeData({
				name: 'image',
				label: 'Image',
				category: 'Input/Output',
				color: '#A08A8A',
				items: [
					{
						type: 'input',
						label: 'x',
						name: 'x',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'y',
						name: 'y',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'image',
						name: 'image',
						value: '@copper',
						accept: ['variable'],
					},
					{
						type: 'input',
						label: 'size',
						name: 'size',
						value: '0',
						accept: ['number', 'variable'],
					},
					{
						type: 'input',
						label: 'rotation',
						name: 'rotation',
						value: '0',
						accept: ['number', 'variable'],
					},
				] as const,
				inputs: 1,
				compile: ({ state: { x, y, image, size, rotation } }) => `draw image ${x} ${y} ${image} ${size} ${rotation} 0`,
			}),
		},
	},
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
				accept: ['number', 'string', 'boolean', 'variable'],
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
				accept: ['number', 'string', 'boolean', 'variable'],
			},
		] as const,
		inputs: 1,
		outputs: [{ label: 'False' }, { label: 'True' }] as const,
		compile: ({ state: { condition, a, b }, next }) => `jump ${next.True?.data.index ?? 0} ${condition} ${a} ${b}`,
		condition: {
			a: (state) => state.condition !== 'always',
			b: (state) => state.condition !== 'always',
		},
	}),
	wait: new NodeData({
		name: 'wait',
		label: 'Wait',
		category: 'Flow Control',
		color: '#6BB2B2',
		items: [
			{
				type: 'input',
				name: 'time',
				value: '0.5',
				accept: ['number', 'variable'],
			},
			{
				type: 'label',
				value: 'sec',
			},
		] as const,
		inputs: 1,
		compile: ({ state: { time } }) => `wait ${time}`,
	}),
	stop: new NodeData({
		name: 'stop',
		label: 'Stop',
		category: 'Flow Control',
		color: '#6BB2B2',
		items: [] as const,
		inputs: 1,
		compile: () => `stop`,
	}),
	drawFlush: new NodeData({
		name: 'drawFlush',
		label: 'Draw Flush',
		category: 'Block Control',
		color: '#D4816B',
		items: [
			{
				type: 'label',
				value: 'to',
			},
			{
				type: 'input',
				name: 'display',
				value: 'display1',
				accept: ['string'],
			},
		] as const,
		inputs: 1,
		compile: ({ state: { display } }) => `drawflush ${display}`,
	}),
} as const;

export const instructionNodes: Record<string, NodeData> = Object.entries(instructionNodesGraph).reduce(
	(acc, [key, value]) => {
		if (value instanceof NodeData) {
			acc[key] = value;
		} else {
			Object.entries(value.children).forEach(([key, value]) => {
				acc[key] = value;
			});
		}

		return acc;
	},
	{} as Record<string, NodeData>,
);

export const nodeOptions = groupBy(Object.entries(instructionNodesGraph), (p) => p[1].category);

export const initialNodes: InstructionNode[] = [
	{
		id: '1',
		data: {
			type: 'start',
			node: instructionNodes.start,
			state: instructionNodes.start.getDefaultState(),
		},
		type: 'instruction',
		position: { x: 450, y: 500 },
	},
];
