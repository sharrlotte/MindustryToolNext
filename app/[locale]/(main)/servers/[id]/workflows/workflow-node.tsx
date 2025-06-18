import { useWorkflowEditor } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-editor.context';



import { cn } from '@/lib/utils';
import {  WorkflowNodeData } from '@/types/response/WorkflowContext';



import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { Connection, useNodeConnections } from '@xyflow/react';


export type WorkflowNode = Node<{ name: string; index?: number } & Omit<WorkflowNodeData, 'x' | 'y' | 'id'>, 'workflow'>;

export default function WorkflowNodeComponent({ id, data }: NodeProps<WorkflowNode>) {
	const { name, index, color, outputs, consumers } = data;

	const items = consumers.length;
	const inputs = 1;

	return (
		<div
			className={cn('p-1.5 rounded-sm text-sm text-white w-[220px] min-h-[80px] sm:w-[330px] md:w-[540px] lg:[w-650px]', {
				'w-fit min-h-0 sm:w-fit md:w-fit lg:w-fit px-6': items === 0,
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
					label={output.name}
					key={i}
					type={'source'}
					position={Position.Right}
				/>
			))}
			<div
				className={cn('flex justify-between text-sm font-bold', {
					'w-full h-full items-center justify-center m-auto text-xl align-middle': items === 0,
				})}
			>
				<span className="font-outline-2">{name}</span>
				<span>{data.index}</span>
			</div>
			{items > 0 && (
				<div className="bg-black p-2 rounded-sm flex gap-1 items-end jus flex-wrap">
					{consumers.map((item, i) => (
						<NodeItemComponent key={i} nodeId={id} color={color} data={item} />
					))}
				</div>
			)}
		</div>
	);
}
type NodeItemComponentProps<T> = { nodeId: string; color: string; data: T };

function NodeItemComponent(props: NodeItemComponentProps<any>) {
	// if (props.data.type === 'input') {
	// 	return <InputNodeComponent {...(props as NodeItemComponentProps<InputItem>)} />;
	// }

	// if (props.data.type === 'option') {
	// 	return <OptionNodeComponent {...(props as NodeItemComponentProps<OptionItem>)} />;
	// }

	if (props.data.type === 'label') {
		return <span className="border-transparent border-b-[3px]">{props.data.value}</span>;
	}
}

// function InputNodeComponent({ data, color, state, nodeId }: NodeItemComponentProps<InputItem>) {
// 	const { variables, setNodeState } = useWorkflowEditor();
// 	const [focus, setFocus] = useState(false);
// 	const value = state[data.name];

// 	const matchedVariable = Object.values(variables).filter((variable) => variable.includes(value));
// 	const showSuggestion = focus && data.accept.includes('variable') && matchedVariable.length > 0;

// 	return (
// 		<div className="flex gap-1">
// 			{data.label && <span className="border-transparent border-b-[3px]">{data.label}</span>}
// 			<div className="relative">
// 				<input
// 					className="bg-transparent border-b-[3px] px-2 hover min-w-10 max-w-20 sm:max-w-40 md:max-w-60 focus:outline-none" //
// 					style={{ borderColor: color }}
// 					type="text"
// 					value={value ?? data.value ?? ''}
// 					onChange={(e) => setNodeState(nodeId, (prev) => ({ ...prev, [data.name]: e.target.value }))}
// 					onFocus={() => setFocus(true)}
// 					onBlur={() => setTimeout(() => setFocus(false), 100)}
// 				/>
// 				<div className={cn('absolute -bottom-1 translate-y-[100%] z-50 hidden', { block: showSuggestion })}>
// 					<div className="p-4 border rounded-md bg-card min-w-60">
// 						{matchedVariable.map((variable) => (
// 							<div key={variable} onClick={() => setNodeState(nodeId, (prev) => ({ ...prev, [data.name]: variable }))}>
// 								{variable}
// 							</div>
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// function OptionNodeComponent({ data, color, state, nodeId }: NodeItemComponentProps<OptionItem>) {
// 	const { setNodeState } = useWorkflowEditor();

// 	return (
// 		<div className="bg-transparent border-b-[3px] flex items-end" style={{ borderColor: color }}>
// 			<ComboBox
// 				className="bg-transparent px-2 py-0 text-center w-fit font-bold border-transparent items-end justify-end"
// 				value={{ value: state[data.name], label: state[data.name].toString() }}
// 				values={data.options.map((option) => ({ value: option, label: option.toString() }))}
// 				onChange={(value) => {
// 					if (value) setNodeState(nodeId, (prev) => ({ ...prev, [data.name]: value }));
// 				}}
// 				searchBar={false}
// 				chevron={false}
// 			/>
// 		</div>
// 	);
// }

export function OutputHandle(props: Parameters<typeof Handle>[0] & { label: string }) {
	const { setEdges } = useWorkflowEditor();
	const connections = useNodeConnections({
		handleType: props.type,
		handleId: props.id ?? '',
		onConnect(connections: Connection[]) {
			setEdges((prevEdges) =>
				prevEdges.map((edge) => (edge.id === (connections[0] as unknown as any).edgeId ? { ...edge, label: props.label } : edge)),
			);
		},
	});

	return <Handle {...props} id={props.id} isConnectable={connections.length < 1} />;
}
