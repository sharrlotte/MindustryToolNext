import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';
import { useRef } from 'react';
import ContentEditable from 'react-contenteditable';

import { useWorkflowEditor } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-editor';

import { CatchError } from '@/components/common/catch-error';
import ComboBox from '@/components/common/combo-box';
import ErrorMessage from '@/components/common/error-message';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

import { WorkflowField, WorkflowFieldConsume } from '@/types/response/WorkflowContext';

import useWorkflowNodeState from '@/hooks/use-workflow-node-state';

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

	const unit = consumer.unit;

	if (unit && (unit === 'SECOND' || unit === 'MILLISECOND')) {
		return <DurationNodeComponent {...props} duration={unit} />;
	}

	if (consumer.options && consumer.options.length > 0) {
		return <OptionNodeComponent {...props} />;
	}

	if (consumer.type === 'java.lang.Boolean') {
		return <BooleanNodeComponent {...props} />;
	}

	return <InputNodeComponent {...props} accept={consumer.type === 'java.lang.String' ? 'STRING' : 'EXPRESSION'} />;
}

function DurationNodeComponent({ duration, name, consumer, parentId }: NodeItemProps & { duration: string }) {
	const { state, update } = useWorkflowNodeState(parentId);
	const { required, defaultValue } = consumer;

	let value = Number(state.fields[name]?.consumer ?? '0') ?? 0;
	value = Number.isNaN(value) ? 0 : value;

	const converted = duration === 'SECOND' ? value * 1000 : duration === 'MILLISECOND' ? value : 0;

	const milliseconds = converted % 1000;
	const seconds = Math.floor((converted / 1000) % 60);
	const minutes = Math.floor((converted / 60000) % 60);
	const hours = Math.floor((converted / 3600000) % 24);
	const days = Math.floor((converted / 86400000) % 365);

	return (
		<div className="min-h-14">
			<div className="text-muted-foreground text-sm flex items-center">
				<span>{name}</span>
				{required && <span className="text-destructive-foreground">*</span>}
			</div>
			<div className="relative flex items-center rounded-md border pr-2">
				<Input
					className="bg-transparent min-w-60 w-full focus:outline-none ring-0 border-none" //
					type="text"
					value={value ?? defaultValue ?? ''}
					onChange={(e) =>
						update((state) => {
							if (state.fields[name] === undefined) {
								state.fields[name] = {};
							}
							state.fields[name].consumer = e.currentTarget.value;
						})
					}
				/>
				<span className="text-muted-foreground text-sm ml-0.5 text-nowrap">
					{days > 0 ? `${days}d ` : ''}
					{hours > 0 ? `${hours}h ` : ''}
					{minutes > 0 ? `${minutes}m ` : ''}
					{seconds > 0 ? `${seconds}s` : ''}
					{milliseconds > 0 ? `${milliseconds}ms` : ''}
				</span>
			</div>
		</div>
	);
}

function BooleanNodeComponent({ name, consumer, parentId }: NodeItemProps) {
	const { required } = consumer;
	const { state, update } = useWorkflowNodeState(parentId);
	const value = state.fields[name]?.consumer;

	let parsed: boolean = false;

	try {
		parsed = Boolean(value ?? 'false');
	} catch (e) {
		parsed = false;
	}

	useEffect(() => {
		if (required && value === undefined) {
			update((state) => {
				if (state.fields[name] === undefined) {
					state.fields[name] = {};
				}
				state.fields[name].consumer = false;
			});
		}
	}, [value, required, update, name]);

	return (
		<div className="flex gap-1 items-center justify-between">
			<span className="text-muted-foreground text-sm">{name}</span>
			<Switch
				checked={parsed}
				onCheckedChange={(value) =>
					update((state) => {
						if (state.fields[name] === undefined) {
							state.fields[name] = {};
						}
						state.fields[name].consumer = value;
					})
				}
			/>
		</div>
	);
}

function OptionNodeComponent({ name, consumer, parentId }: NodeItemProps) {
	const { options, required } = consumer;
	const first = options[0];

	const { state, update } = useWorkflowNodeState(parentId);
	const value = state.fields[name]?.consumer;

	const v = options.find((option) => option.value === value);

	useEffect(() => {
		if (required && !v && options.length > 0) {
			update((state) => {
				if (state.fields[name] === undefined) {
					state.fields[name] = {};
				}
				state.fields[name].consumer = first.value;
			});
		}
	}, [first.value, name, options.length, parentId, required, update, v]);

	return (
		<div className="min-h-14">
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

					update((state) => {
						if (state.fields[name] === undefined) {
							state.fields[name] = {};
						}
						state.fields[name].consumer = value;
					});
				}}
				mapper={({ label }) => (
					<span key={label} className="text-xs">
						{label}
					</span>
				)}
			/>
		</div>
	);
}

type InputNodeAccept = 'STRING' | 'EXPRESSION';

function InputNodeComponent({ name, consumer, parentId, accept }: NodeItemProps & { accept: InputNodeAccept }) {
	const { variables } = useWorkflowEditor();
	const { state, update } = useWorkflowNodeState(parentId);
	const { type, required } = consumer;
	const [focus, setFocus] = useState(false);
	const value = state.fields[name]?.consumer ?? '';

	const matchedVariable = value
		? Object.values(variables).filter((variable) => variable.includes(value))
		: Object.values(variables);

	const showSuggestion = focus && type.includes('variable') && matchedVariable.length > 0;
	const divRef = useRef<HTMLDivElement>(null);
	const tokens = useMemo(() => checkSyntax(tokenize(value), accept), [value, accept]);
	const html = useMemo(() => DOMPurify.sanitize(renderHighlighted(tokens)), [tokens]);
	const errors = useMemo(() => tokens.filter((token) => token.type === 'ERROR').map((token) => token.error), [tokens]);

	return (
		<div className="min-h-14 max-w-lg">
			<div className="text-muted-foreground text-sm flex items-center">
				<span>{name}</span>
				{required && <span className="text-destructive-foreground">*</span>}
			</div>
			<div className="relative w-full">
				{/* <pre
					className="absolute flex items-center pointer-events-none p-0 m-0 min-h-0 top-0 left-0 w-full h-full bg-transparent overflow-auto whitespace-pre-wrap rounded-md px-3 py-2 text-base"
					ref={preRef}
				>
					{highlighted}
				</pre> */}
				<ContentEditable
					suppressContentEditableWarning
					innerRef={divRef}
					className="bg-transparent min-w-60 focus:outline-none" //
					onChange={(e) => {
						update((state) => {
							if (state.fields[name] === undefined) {
								state.fields[name] = {};
							}
							state.fields[name].consumer = e.currentTarget.textContent ?? '';
						});
					}}
					aria-placeholder={type}
					spellCheck={false}
					onFocus={() => setFocus(true)}
					onBlur={() => setTimeout(() => setFocus(false), 100)}
					html={html}
				/>
				{errors.length > 0 && <p className="text-red-400 border-t text-xs">{errors.join('\n')}</p>}
				<div className={cn('absolute -bottom-1 translate-y-[100%] z-50 hidden', { block: showSuggestion })}>
					<div className="p-4 border rounded-md bg-card min-w-60">
						{matchedVariable.map((variable) => (
							<div
								key={variable}
								onClick={() =>
									update((state) => {
										if (state.fields[name] === undefined) {
											state.fields[name] = {};
										}
										state.fields[name].consumer = variable;
									})
								}
							>
								{variable}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

type TokenType = 'KEYWORD' | 'IDENTIFIER' | 'NUMBER' | 'OPERATOR' | 'SYMBOL' | 'EOF' | 'STRING' | 'CLASS';

type Token =
	| {
			type: TokenType;
			value: string;
	  }
	| {
			type: 'ERROR';
			value: string;

			error: string;
	  };

const KEYWORDS = ['true', 'false'];
const OPERATORS = ['+', '-', '*', '/', '=', '=='];
const SYMBOLS = ['(', ')'];

const regex = /\s*(=>|==|[A-Za-z_][A-Za-z0-9_]*|\d+|[+\-*/=()])\s*/g;

function tokenize(input: string): Token[] {
	const tokens: Token[] = [];
	let match;
	let lastIndex = 0;

	while ((match = regex.exec(input)) !== null) {
		const value = match[0];
		const trimmedValue = value.trim();

		const index = match.index;

		const rest = input.substring(lastIndex, index);

		if (rest.length > 0) {
			tokens.push({ type: 'STRING', value: rest });
		}

		lastIndex = index + match[0].length;

		if (KEYWORDS.includes(trimmedValue)) tokens.push({ type: 'KEYWORD', value });
		else if (OPERATORS.includes(trimmedValue)) tokens.push({ type: 'OPERATOR', value });
		else if (SYMBOLS.includes(trimmedValue)) tokens.push({ type: 'SYMBOL', value });
		else if (!isNaN(Number(trimmedValue))) tokens.push({ type: 'NUMBER', value });
		else if (/^[A-Z]\w[a-zA-Z_]*$/.test(trimmedValue)) tokens.push({ type: 'CLASS', value });
		else if (/^[a-zA-Z_]\w*$/.test(trimmedValue)) tokens.push({ type: 'IDENTIFIER', value });
		else tokens.push({ type: 'ERROR', value, error: `Unrecognized token: ${value}` });
	}

	if (lastIndex < input.length) {
		tokens.push({ type: 'STRING', value: input.substring(lastIndex, input.length) });
	}

	tokens.push({ type: 'EOF', value: '' });

	return tokens;
}

function checkSyntax(tokens: Token[], accept: InputNodeAccept): Token[] {
	const result: Token[] = [];

	if (accept === 'STRING') {
		return tokens;
	}

	let current = 0;
	let step = 0;
	let position = 0;

	const peek = () => tokens[current];
	const peekNext = (index: number = 1) => tokens[current + index];
	const advance = () => {
		position += tokens[current].value.length;
		let token = tokens[current++];

		while (token.type === 'STRING' && token.value.trim().length === 0) {
			token = tokens[current++];
		}

		return token;
	};

	const match = (type: TokenType, value?: string) => {
		const token = peek();
		return token.type === type && (value ? token.value === value : true);
	};

	const consume = (types: TokenType[], value?: string): Token => {
		const token = advance();

		if (!types.includes(token.type as TokenType)) {
			return { ...token, type: 'ERROR', error: `Expected ${types.join(' or ')}, got ${token.value}` };
		}

		if (value && token.value !== value) {
			return { ...token, type: 'ERROR', error: `Expected ${value}, got ${token.value}` };
		}

		return token;
	};

	while (current < tokens.length - 1 && step < 10000) {
		step++;
		const token = peek();

		if (token.type === 'NUMBER' && peekNext().type === 'OPERATOR' && peekNext(2).type === 'NUMBER') {
			result.push(consume(['NUMBER']));
			result.push(consume(['OPERATOR']));
			result.push(consume(['NUMBER']));
		} else if (token.type === 'NUMBER') {
			result.push(consume(['NUMBER']));
		} else if (token.type === 'KEYWORD' && token.value === 'let') {
			result.push(consume(['KEYWORD']));
			result.push(consume(['IDENTIFIER']));
			result.push(consume(['OPERATOR']));
			result.push(...parseExpression());
		} else if (token.type === 'KEYWORD' && token.value === 'print') {
			result.push(consume(['KEYWORD'], 'print'));
			result.push(...parseExpression());
		} else {
			result.push({ ...token, type: 'ERROR', error: `Unexpected token: ${token.type} ${token.value} at ${position}` });
			current++;
		}
	}

	return result;

	function parseExpression(): Token[] {
		const expr: Token[] = [];
		expr.push(consume(['NUMBER']));
		while (match('OPERATOR')) {
			expr.push(consume(['OPERATOR']));
			expr.push(consume(['NUMBER']));
		}
		return expr;
	}
}

const colors: Record<Token['type'], string> = {
	KEYWORD: 'text-blue-400 font-semibold',
	IDENTIFIER: 'text-cyan-300',
	CLASS: 'text-emerald-500',
	NUMBER: 'text-blue-400',
	OPERATOR: 'text-gray-200',
	SYMBOL: 'text-yellow-400',
	STRING: '',
	EOF: '',
	ERROR: 'text-red-400 underline underline-offset-2 decoration-dotted decoration-red-500',
};

const base = 'caret-foreground';

function renderHighlighted(tokens: Token[]): string {
	return tokens
		.map(({ value, type }) => {
			const className = colors[type];

			return `<span class="${cn(base, className)}" isContentEditable="true">${value}</span>`;
		})
		.join('');
}
