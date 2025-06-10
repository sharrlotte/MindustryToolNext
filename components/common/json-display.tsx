import { Fragment } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const KEY_PATTERN = /[a-zA-Z0-9_-]+/;

function parseCustomJson(str: any) {
	if (typeof str !== 'string') {
		return str;
	}

	if (str.startsWith('[') && str.endsWith(']')) {
		str = str.substring(1, str.length - 1);

		if (str.length === 0) {
			return '[]';
		}

		const result: string[] = [];

		while (str.includes(',')) {
			let nextCommaIndex = -1;

			const stack = [];

			for (let i = 0; i < str.length; i++) {
				const char = str[i];

				if (char === '{') {
					stack.push('{');
				} else if (char === '}') {
					for (let j = stack.length - 1; j >= 0; j--) {
						if (stack[j] === '{') {
							stack.pop();
							break;
						}
					}
				} else if (char === '[') {
					stack.push('[');
				} else if (char === ']') {
					for (let j = stack.length - 1; j >= 0; j--) {
						if (stack[j] === '[') {
							stack.pop();
							break;
						}
					}
				} else if (char === ',') {
					if (stack.length === 0) {
						nextCommaIndex = i;
						break;
					}
				}
			}
			const value = nextCommaIndex === -1 ? str : str.substring(0, nextCommaIndex);

			result.push(parseCustomJson(value));

			str = nextCommaIndex === -1 ? '' : str.substring(nextCommaIndex + 1);
		}

		return result;
	}

	if (str.startsWith('{') && str.endsWith('}') && str.includes(':')) {
		str = str.substring(1, str.length - 1);

		if (str.length === 0) {
			return '{}';
		}

		const result: Record<string, any> = {};

		while (str.includes(':')) {
			const stack = [];
			const colonIndex = str.indexOf(':');
			let nextCommaIndex = -1;

			const keyString = str.substring(0, colonIndex);

			const isValidKey = KEY_PATTERN.test(keyString);

			if (isValidKey) {
				str = str.substring(colonIndex + 1);

				for (let i = 0; i < str.length; i++) {
					const char = str[i];

					if (char === '{') {
						stack.push('{');
					} else if (char === '}') {
						for (let j = stack.length - 1; j >= 0; j--) {
							if (stack[j] === '{') {
								stack.pop();
								break;
							}
						}
					} else if (char === '[') {
						stack.push('[');
					} else if (char === ']') {
						for (let j = stack.length - 1; j >= 0; j--) {
							if (stack[j] === '[') {
								stack.pop();
								break;
							}
						}
					} else if (char === ',') {
						if (stack.length === 0) {
							nextCommaIndex = i;
							break;
						}
					}
				}
				const value = nextCommaIndex === -1 ? str : str.substring(0, nextCommaIndex);

				result[keyString] = parseCustomJson(value);
			}

			str = nextCommaIndex === -1 ? '' : str.substring(nextCommaIndex + 1);
		}

		return result;
	}

	return str;
}

function parseCustomJsonNested(json: any) {
	if (json === null) {
		return null;
	}

	switch (typeof json) {
		case 'bigint':
		case 'boolean':
		case 'number':
		case 'undefined':
			return json;

		case 'string':
			return parseCustomJson(json);

		case 'object': {
			if (Array.isArray(json)) {
				return json.map((item) => parseCustomJson(item));
			}

			return Object.fromEntries(
				Object.entries(json)
					.sort(([a], [b]) => b.localeCompare(a))
					.map(([key, value]) => [key, parseCustomJson(value)]),
			);
		}

		case 'function':
		case 'symbol':
		default:
			return undefined;
	}
}

export default function JsonDisplay({ json, depth = 0 }: { json: any; depth?: number }) {
	if (json === null) {
		return null;
	}

	json = parseCustomJsonNested(json);

	switch (typeof json) {
		case 'string':
		case 'bigint':
		case 'boolean':
		case 'number':
		case 'undefined':
			return <p className="text-wrap w-full">{json}</p>;

		case 'object': {
			if (Array.isArray(json)) {
				const isObjectArray = json.some((item) => typeof item === 'object');

				return (
					<div>
						[{isObjectArray && <br />}
						<div className="pl-4">
							{json.map((item, index) => (
								<Fragment key={index}>
									<JsonDisplay key={index} depth={++depth} json={item} />
									{isObjectArray && <br />}
								</Fragment>
							))}
						</div>
						]
					</div>
				);
			}

			return (
				<>
					<span>{'{'}</span>
					<div className="pl-4 divide-y">
						{Object.entries(json)
							.sort(([a], [b]) => b.localeCompare(a))
							.map(([key, value]) => (
								<div className="py-2" key={key}>
									{typeof value === 'string' || typeof value === 'number' || value === '{}' || value === '' ? (
										<span className="space-x-1">
											<span>{key}:</span>
											<span>{value}</span>
										</span>
									) : (
										<Accordion type="single" collapsible>
											<AccordionItem value={key}>
												<AccordionTrigger className="h-fit p-0">
													{key}: {Array.isArray(value) ? '[...]' : typeof value === 'object' ? '{...}' : ''}
												</AccordionTrigger>
												<AccordionContent>
													<JsonDisplay json={value} depth={++depth} />
												</AccordionContent>
											</AccordionItem>
										</Accordion>
									)}
								</div>
							))}
					</div>
					<span>{'}'}</span>
				</>
			);
		}

		case 'function':
		case 'symbol':
		default:
			return undefined;
	}
}
