import { useState } from 'react';

import { useLogicEditor } from '@/app/[locale]/logic/logic-editor.context';
import { InferStateType, InputItem, ItemsType, NodeItem, OptionItem, instructionNodes } from '@/app/[locale]/logic/node';
import { OutputHandle } from '@/app/[locale]/logic/output-handle';

import ComboBox from '@/components/common/combo-box';

import { cn } from '@/lib/utils';

import { Handle, Node, Position } from '@xyflow/react';

export type InstructionNodeData<T extends (keyof typeof instructionNodes)[number] = (keyof typeof instructionNodes)[number]> = {
	data: { type: T; index?: number; state: InferStateType<(typeof instructionNodes)[T]['items']> };
	isConnectable?: boolean;
	type: 'instruction';
	id: string;
};

export type InstructionNode = Omit<Node, 'data' | 'type'> & InstructionNodeData;

export default function InstructionNodeComponent({ id, data }: InstructionNodeData) {
	const { state, type } = data;
	const node = instructionNodes[type];
	const { label, color, inputs, outputs, items, condition } = node;

	const filteredItems = items.filter(
		(item) => 'name' in item && (!condition || !condition?.[item.name] || condition?.[item.name]?.(state)),
	);

	return (
		<div
			className={cn('p-1.5 rounded-sm text-sm text-white w-[220px] min-h-[80px] sm:w-[330px] md:w-[540px] lg:[w-650px]', {
				'w-fit min-h-0 sm:w-fit md:w-fit lg:w-fit px-6': items.length === 0,
			})}
			style={{ backgroundColor: color }}
		>
			{Array(inputs)
				.fill(1)
				.map((_, i) => (
					<Handle
						style={{ marginTop: 20 * i - ((inputs - 1) / 2) * 20 + 'px' }}
						key={i}
						type={'target'}
						position={Position.Left}
						isConnectable={true}
					/>
				))}
			{outputs.map((output, i) => (
				<OutputHandle
					id={`${id}-source-handle-${i}`}
					style={{ marginTop: 20 * i - ((outputs.length - 1) / 2) * 20 + 'px' }}
					label={output.label}
					key={i}
					type={'source'}
					position={Position.Right}
				/>
			))}
			<div
				className={cn('flex justify-between text-sm font-bold', {
					'w-full h-full items-center justify-center m-auto text-xl align-middle': items.length === 0,
				})}
			>
				<span className="font-outline-2">{label}</span>
				<span>{data.index}</span>
			</div>
			{items.length > 0 && (
				<div className="bg-black p-2 rounded-sm flex gap-1 items-end jus flex-wrap">
					{filteredItems.map((item, i) => (
						<NodeItemComponent key={i} nodeId={id} color={color} data={item} state={state} />
					))}
				</div>
			)}
		</div>
	);
}
type NodeItemComponentProps<T> = { nodeId: string; color: string; state: InferStateType<ItemsType>; data: T };

function NodeItemComponent(props: NodeItemComponentProps<NodeItem>) {
	if (props.data.type === 'input') {
		return <InputNodeComponent {...(props as NodeItemComponentProps<InputItem>)} />;
	}

	if (props.data.type === 'option') {
		return <OptionNodeComponent {...(props as NodeItemComponentProps<OptionItem>)} />;
	}

	if (props.data.type === 'label') {
		return <span className="border-transparent border-b-[3px]">{props.data.value}</span>;
	}
}

function InputNodeComponent({ data, color, state, nodeId }: NodeItemComponentProps<InputItem>) {
	const { variables, setNodeState } = useLogicEditor();
	const [focus, setFocus] = useState(false);
	const value = state[data.name];

	const matchedVariable = Object.values(variables).filter((variable) => variable.includes(value));
	const showSugesstion = focus && data.accept.includes('variable') && matchedVariable.length > 0;

	return (
		<div className="flex gap-1">
			{data.label && <span className="border-transparent border-b-[3px]">{data.label}</span>}
			<div className="relative">
				<input
					className="bg-transparent border-b-[3px] px-2 hover min-w-10 max-w-20 sm:max-w-40 md:max-w-60 focus:outline-none" //
					style={{ borderColor: color }}
					type="text"
					value={value ?? data.value ?? ''}
					onChange={(e) => setNodeState(nodeId, (prev) => ({ ...prev, [data.name]: e.target.value }))}
					onFocus={() => setFocus(true)}
					onBlur={() => setTimeout(() => setFocus(false), 100)}
				/>
				<div className={cn('absolute -bottom-1 translate-y-[100%] z-50 hidden', { block: showSugesstion })}>
					<div className="p-4 border rounded-md bg-card min-w-60">
						{matchedVariable.map((variable) => (
							<div key={variable} onClick={() => setNodeState(nodeId, (prev) => ({ ...prev, [data.name]: variable }))}>
								{variable}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function OptionNodeComponent({ data, color, state, nodeId }: NodeItemComponentProps<OptionItem>) {
	const { setNodeState } = useLogicEditor();

	return (
		<div className="bg-transparent border-b-[3px] flex items-end" style={{ borderColor: color }}>
			<ComboBox
				className="bg-transparent px-2 py-0 text-center w-fit font-bold border-transparent items-end justify-end"
				value={{ value: state[data.name], label: state[data.name].toString() }}
				values={data.options.map((option) => ({ value: option, label: option.toString() }))}
				onChange={(value) => {
					if (value) setNodeState(nodeId, (prev) => ({ ...prev, [data.name]: value }));
				}}
				searchBar={false}
				chevron={false}
			/>
		</div>
	);
}
