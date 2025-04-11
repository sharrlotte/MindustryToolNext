import { instructionNodes, useLogicEditor } from '@/app/[locale]/logic/logic-editor-context';
import { InferStateType, ItemsType, NodeData, NodeItem } from '@/app/[locale]/logic/node';
import { OutputHandle } from '@/app/[locale]/logic/output-handle';

import ComboBox from '@/components/common/combo-box';

import { cn } from '@/lib/utils';

import { Handle, Node, Position } from '@xyflow/react';

export type InstructionNodeData<T extends (keyof typeof instructionNodes)[number] = (keyof typeof instructionNodes)[number]> = {
	data: { type: T; index?: number; node: NodeData; state: InferStateType<(typeof instructionNodes)[T]['items']> };
	isConnectable?: boolean;
	type: 'instruction';
	id: string;
};

export type InstructionNode = Omit<Node, 'data' | 'type'> & InstructionNodeData;

export default function InstructionNodeComponent({ id, data }: InstructionNodeData) {
	const { state, node } = data;
	const { label, color, inputs, outputs, items, condition } = node;

	const filterdItems = items.filter((item) => 'name' in item && (!condition || !condition?.[item.name] || condition?.[item.name]?.(state)));

	return (
		<div
			className={cn('p-1.5 rounded-sm text-white w-[220px] min-h-[80px] sm:w-[330px] md:w-[440px] lg:[w-550px]', {
				'w-fit min-h-0 sm:w-fit md:w-fit lg:w-fit px-6': items.length === 0,
			})}
			style={{ backgroundColor: color }}
		>
			{Array(inputs)
				.fill(1)
				.map((_, i) => (
					<Handle style={{ marginLeft: 20 * i - ((inputs - 1) / 2) * 20 + 'px' }} key={i} type={'target'} position={Position.Top} isConnectable={true} />
				))}
			{outputs.map((output, i) => (
				<OutputHandle id={`${id}-source-handle-${i}`} style={{ marginLeft: 20 * i - ((outputs.length - 1) / 2) * 20 + 'px' }} label={output.label} key={i} type={'source'} position={Position.Bottom} />
			))}
			<div
				className={cn('flex justify-between text-sm font-bold', {
					'w-full h-full items-center justify-center m-auto text-xl align-middle': items.length === 0,
				})}
			>
				<span>{label}</span>
				<span>{data.index}</span>
			</div>
			{items.length > 0 && (
				<div className="bg-black p-2 rounded-sm flex gap-1 items-end jus flex-wrap">
					{filterdItems.map((item, i) => (
						<NodeItemComponent key={i} nodeId={id} color={color} data={item} state={state} />
					))}
				</div>
			)}
		</div>
	);
}

function NodeItemComponent({ nodeId, color, data, state }: { nodeId: string; color: string; state: InferStateType<ItemsType>; data: NodeItem }) {
	const { setNodeState } = useLogicEditor();

	if (data.type === 'input') {
		return (
			<div className="flex gap-1 w-40">
				{data.label && <span className="border-transparent border-b-[3px]">{data.label}</span>}
				<input
					className="bg-transparent border-b-[3px] px-2 hover min-w-20 max-w-40 sm:max-w-80 focus:outline-none" //
					style={{ borderColor: color }}
					type="text"
					value={state[data.name] ?? data.value ?? ''}
					onChange={(e) => setNodeState(nodeId, (prev) => ({ ...prev, [data.name]: e.target.value }))}
				/>
			</div>
		);
	}

	if (data.type === 'option') {
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

	if (data.type === 'label') {
		return <span className="border-transparent border-b-[3px]">{data.value}</span>;
	}
}
