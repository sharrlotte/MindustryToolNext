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
