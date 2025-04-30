import { useMemo, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import { InstructionNode } from '@/app/[locale]/logic/instruction.node';
import { useLogicEditor } from '@/app/[locale]/logic/logic-editor.context';
import { instructionNodes } from '@/app/[locale]/logic/node';

import Tran from '@/components/common/tran';
import Divider from '@/components/ui/divider';
import { Input } from '@/components/ui/input';

import { useReactFlow, useViewport } from '@xyflow/react';

type Match = {
	node: InstructionNode;
	matches: {
		label: string;
		value: string;
	}[];
};

export default function SearchPanel() {
	const { debouncedNodes } = useLogicEditor();
	const [filter, setFilter] = useState('');
	const [debouncedFilter] = useDebounceValue(filter, 200);
	const { setCenter } = useReactFlow();
	const { zoom } = useViewport();

	function handleClick(node: InstructionNode) {
		setCenter(node.position.x, node.position.y, {
			zoom,
		});
	}

	const matchedNodes: Match[] = useMemo(() => {
		if (!debouncedFilter) return [];

		return debouncedNodes.reduce<Match[]>((result, node) => {
			const nodeData = instructionNodes[node.data.type];

			const matches: Match['matches'] = [];

			if (nodeData.label.toLowerCase().includes(debouncedFilter)) {
				matches.push({ label: 'label', value: nodeData.label });
			}

			if (nodeData.category.includes(debouncedFilter)) {
				matches.push({ label: 'label', value: nodeData.category });
			}

			for (const item of nodeData.items) {
				if (item.type === 'label') {
					if (item.value.toLowerCase().includes(debouncedFilter.toLowerCase())) {
						matches.push({ label: 'label', value: item.value });
					}
				} else if (item.type === 'option') {
					if (item.name.toLowerCase().includes(debouncedFilter.toLowerCase())) {
						matches.push({ label: 'label', value: item.name });
					}

					for (const option of item.options) {
						if (option.toLowerCase().includes(debouncedFilter.toLowerCase())) {
							matches.push({ label: 'option', value: option });
						}
					}
				} else if (item.type === 'input') {
					if (item.value.toLowerCase().includes(debouncedFilter.toLowerCase())) {
						matches.push({ label: 'variable', value: item.value });
					}

					if (node.data.state[item.name]?.toLowerCase().includes(debouncedFilter.toLowerCase())) {
						matches.push({ label: 'variable', value: node.data.state[item.name] });
					}

					if (item.label?.toLowerCase().includes(debouncedFilter.toLowerCase())) {
						matches.push({ label: 'label', value: item.label });
					}
				}
			}

			if (matches.length > 0) {
				result.push({
					node,
					matches,
				});
			}

			return result;
		}, []);
	}, [debouncedFilter, debouncedNodes]);

	return (
		<div className="space-y-2 h-full overflow-hidden">
			<Input placeholder="Search" value={filter} onChange={(event) => setFilter(event.currentTarget.value)} />
			<Divider />
			<section className="space-y-2 overflow-y-auto">
				{matchedNodes.length > 0 && <Tran text="found" args={{ count: matchedNodes.length }} />}
				{matchedNodes.map(({ node, matches }) => {
					const nodeData = instructionNodes[node.data.type];
					return (
						<div className="cursor-pointer p-2 rounded-md border bg-secondary/70" key={node.id} onClick={() => handleClick(node)}>
							<h3 className="space-x-1 p-0">
								<span
									className="font-semibold"
									style={{
										color: nodeData.color,
									}}
								>
									{nodeData.label}
								</span>
								<span className="space-x-1 text-xs">
									({Math.round(node.position.x)},{Math.round(node.position.y)})
								</span>
							</h3>
							<section className="text-sm">
								{matches.map(({ label, value }, index) => (
									<div key={index}>
										<span className="text-foreground">{label}: </span>
										{value.substring(0, value.indexOf(debouncedFilter))}
										<span className="underline">{debouncedFilter}</span>
										{value.substring(value.indexOf(debouncedFilter) + debouncedFilter.length)}
									</div>
								))}
							</section>
						</div>
					);
				})}
			</section>
		</div>
	);
}
