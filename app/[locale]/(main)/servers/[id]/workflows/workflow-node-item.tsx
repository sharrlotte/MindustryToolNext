import { useState } from 'react';

import { useWorkflowEditor } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-editor';
import { updateConsumer } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow.utils';

import ComboBox from '@/components/common/combo-box';
import ErrorMessage from '@/components/common/error-message';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

import { WorkflowNodeData } from '@/types/response/WorkflowContext';

import { cn } from '@/lib/utils';

type NodeItemProps = { variant: 'inline' | 'panel'; parentId: string; data: WorkflowNodeData['consumers'][number] };

export default function NodeItem(props: NodeItemProps) {
	return (
		<div
			className={cn('flex flex-col gap-1 z-50', {
				'bg-card rounded-sm px-2 py-1 border': props.variant === 'inline',
			})}
		>
			<NodeItemInternal {...props} />
		</div>
	);
}

function NodeItemInternal(props: NodeItemProps) {
	const { data } = props;
	// if (props.data.type === 'input') {
	// 	return <InputNodeComponent {...(props as NodeItemProps<InputItem>)} />;
	// }
	// if (props.data.type === 'option') {
	// 	return <OptionNodeComponent {...(props as NodeItemProps<OptionItem>)} />;
	// }

	if (data.unit === 'SECOND') {
		return <SecondNodeComponent {...props} />;
	}

	if (data.options && data.options.length > 0) {
		return <OptionNodeComponent {...props} />;
	}

	if (data.type === 'java.lang.Boolean') {
		return <BooleanNodeComponent {...props} />;
	}

	if (data.type === 'java.lang.String') {
		return <InputNodeComponent {...props} />;
	}

	return <ErrorMessage error={{ message: 'Invalid consumer type: ' + data.type + ' on consumer: ' + data.name }} />;
}

function SecondNodeComponent({ data, parentId }: NodeItemProps) {
	const { setNode } = useWorkflowEditor();
	const { name, value, required } = data;

	const hours = Math.floor(Number(value ?? 0) / 3600);
	const minutes = Math.floor((Number(value ?? 0) % 3600) / 60);
	const seconds = Number(value ?? 0) % 60;

	return (
		<>
			<div className="text-muted-foreground text-sm flex items-center">
				<span>{name}</span>
				{required && <span className="text-destructive-foreground">*</span>}
			</div>
			<div className="relative flex items-center">
				<Input
					className="bg-transparent min-w-10 max-w-20 sm:max-w-40 md:max-w-60 focus:outline-none" //
					type="text"
					value={value ?? value ?? ''}
					onChange={(e) => setNode(parentId, (prev) => updateConsumer(prev, name, e.currentTarget.value))}
				/>
				<span className="text-muted-foreground text-sm ml-0.5">
					{hours > 0 ? `${hours}h ` : ''}
					{minutes > 0 ? `${minutes}m ` : ''}
					{seconds > 0 ? `${seconds}s` : ''}
				</span>
			</div>
		</>
	);
}

function InputNodeComponent({ data, parentId }: NodeItemProps) {
	const { variables, setNode } = useWorkflowEditor();
	const { name, value, type, required } = data;
	const [focus, setFocus] = useState(false);

	const matchedVariable = value
		? Object.values(variables).filter((variable) => variable.includes(value))
		: Object.values(variables);

	const showSuggestion = focus && type.includes('variable') && matchedVariable.length > 0;

	return (
		<>
			<div className="text-muted-foreground text-sm flex items-center">
				<span>{name}</span>
				{required && <span className="text-destructive-foreground">*</span>}
			</div>
			<div className="relative">
				<Input
					className="bg-transparent min-w-10 max-w-20 sm:max-w-40 md:max-w-60 focus:outline-none" //
					type="text"
					value={value ?? value ?? ''}
					onChange={(e) => setNode(parentId, (prev) => updateConsumer(prev, name, e.currentTarget.value))}
					onFocus={() => setFocus(true)}
					onBlur={() => setTimeout(() => setFocus(false), 100)}
				/>
				<div className={cn('absolute -bottom-1 translate-y-[100%] z-50 hidden', { block: showSuggestion })}>
					<div className="p-4 border rounded-md bg-card min-w-60">
						{matchedVariable.map((variable) => (
							<div key={variable} onClick={() => setNode(parentId, (prev) => ({ ...prev, [data.name]: variable }))}>
								{variable}
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

function BooleanNodeComponent({ data, parentId }: NodeItemProps) {
	const { setNode } = useWorkflowEditor();
	const { name, value } = data;

	let parsed: boolean = false;

	try {
		parsed = Boolean(value ?? 'false');
	} catch (e) {
		parsed = false;
	}

	return (
		<div className="flex gap-1 items-center justify-between">
			<span className="text-muted-foreground text-sm">{name}</span>
			<Switch checked={parsed} onCheckedChange={(value) => setNode(parentId, (prev) => updateConsumer(prev, name, value))} />
		</div>
	);
}

function OptionNodeComponent({ data, parentId }: NodeItemProps) {
	const { options, required, name, value } = data;
	const first = options[0];

	const { setNode } = useWorkflowEditor();
	const v = options.find((option) => option.value === value);

	return (
		<>
			<div className="text-muted-foreground text-sm flex items-center">
				<span>{name}</span>
				{required && <span className="text-destructive-foreground">*</span>}
			</div>
			<ComboBox<string>
				className="w-full"
				value={v ?? first}
				required={required}
				searchBar={options.length > 15}
				values={options}
				onChange={(value: any) => {
					if (required && !data) {
						return;
					}

					setNode(parentId, (prev) => updateConsumer(prev, name, value));
				}}
				mapper={({ label }) => (
					<span key={label} className="text-xs">
						{label}
					</span>
				)}
			/>
		</>
	);
}
