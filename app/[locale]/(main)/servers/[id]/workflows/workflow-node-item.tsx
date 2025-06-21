import { useEffect, useState } from 'react';

import { useWorkflowEditor } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-editor';
import { updateConsume } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow.utils';

import { CatchError } from '@/components/common/catch-error';
import ComboBox from '@/components/common/combo-box';
import ErrorMessage from '@/components/common/error-message';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

import { WorkflowField, WorkflowFieldConsume } from '@/types/response/WorkflowContext';

import { cn } from '@/lib/utils';

type Props = { variant: 'inline' | 'panel'; parentId: string; data: WorkflowField };

export default function NodeItem(props: Props) {
	const { data, parentId, variant } = props;
	const { errors } = useWorkflowEditor();
	const error = errors[parentId]?.[data.name];
	const { name, producer, consumer } = data;

	return (
		<div
			className={cn('flex flex-col gap-1 z-50 nowheel', {
				'bg-card rounded-sm px-2 py-1 border': props.variant === 'inline',
			})}
		>
			<CatchError>
				{consumer && <NodeItemInternal {...{ name, consumer, variant, parentId }} />}
				{producer && producer.produceType && variant === 'panel' && <div>{producer.variableName}</div>}
				{error && <span className="text-destructive-foreground text-xs">{error}</span>}
			</CatchError>
		</div>
	);
}

type NodeItemProps = { variant: 'inline' | 'panel'; parentId: string; name: string; consumer: WorkflowFieldConsume };

function NodeItemInternal(props: NodeItemProps) {
	const { consumer } = props;

	if (!consumer) {
		return <ErrorMessage error={{ message: 'Invalid fields type: ' + props.name }} />;
	}

	if (consumer.unit === 'SECOND') {
		return <SecondNodeComponent {...props} />;
	}

	if (consumer.options && consumer.options.length > 0) {
		return <OptionNodeComponent {...props} />;
	}

	if (consumer.type === 'java.lang.Boolean') {
		return <BooleanNodeComponent {...props} />;
	}

	if (consumer.type === 'java.lang.String') {
		return <InputNodeComponent {...props} />;
	}

	return <ErrorMessage error={{ message: 'Invalid fields type: ' + consumer.type + ' on fields: ' + props.name }} />;
}

function SecondNodeComponent({ name, consumer, parentId }: NodeItemProps) {
	const { setNode } = useWorkflowEditor();
	const { value, required } = consumer;

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
					className="bg-transparent min-w-60 w-full focus:outline-none" //
					type="text"
					value={value ?? value ?? ''}
					onChange={(e) => setNode(parentId, (prev) => updateConsume(prev, name, e.currentTarget.value))}
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

function InputNodeComponent({ name, consumer, parentId }: NodeItemProps) {
	const { variables, setNode } = useWorkflowEditor();
	const { value, type, required } = consumer;
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
					className="bg-transparent min-w-60 focus:outline-none" //
					type="text"
					value={value ?? value ?? ''}
					onChange={(e) => setNode(parentId, (prev) => updateConsume(prev, name, e.currentTarget.value))}
					onFocus={() => setFocus(true)}
					onBlur={() => setTimeout(() => setFocus(false), 100)}
				/>
				<div className={cn('absolute -bottom-1 translate-y-[100%] z-50 hidden', { block: showSuggestion })}>
					<div className="p-4 border rounded-md bg-card min-w-60">
						{matchedVariable.map((variable) => (
							<div key={variable} onClick={() => setNode(parentId, (prev) => ({ ...prev, [name]: variable }))}>
								{variable}
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

function BooleanNodeComponent({ name, consumer, parentId }: NodeItemProps) {
	const { setNode } = useWorkflowEditor();
	const { value } = consumer;

	let parsed: boolean = false;

	try {
		parsed = Boolean(value ?? 'false');
	} catch (e) {
		parsed = false;
	}

	return (
		<div className="flex gap-1 items-center justify-between">
			<span className="text-muted-foreground text-sm">{name}</span>
			<Switch checked={parsed} onCheckedChange={(value) => setNode(parentId, (prev) => updateConsume(prev, name, value))} />
		</div>
	);
}

function OptionNodeComponent({ name, consumer, parentId }: NodeItemProps) {
	const { options, required, value } = consumer;
	const first = options[0];

	const { setNode } = useWorkflowEditor();
	const v = options.find((option) => option.value === value);

	useEffect(() => {
		if (required && !v && options.length > 0) {
			setNode(parentId, (prev) => updateConsume(prev, name, first.value));
		}
	}, [first.value, name, options.length, parentId, required, setNode, v]);

	return (
		<>
			<div className="text-muted-foreground text-sm flex items-center">
				<span>{name}</span>
				{required && <span className="text-destructive-foreground">*</span>}
			</div>
			<ComboBox<string>
				className="w-full min-w-60"
				value={v ?? first}
				required={required}
				searchBar={options.length > 15}
				values={options}
				onChange={(value: any) => {
					if (required && !value) {
						return;
					}

					setNode(parentId, (prev) => updateConsume(prev, name, value));
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
