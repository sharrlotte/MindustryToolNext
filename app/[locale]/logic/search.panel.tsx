import { useMemo, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import { InstructionNode } from '@/app/[locale]/logic/instruction.node';
import { useLogicEditor } from '@/app/[locale]/logic/logic-editor.context';
import { instructionNodes } from '@/app/[locale]/logic/node';

import Divider from '@/components/ui/divider';
import { Input } from '@/components/ui/input';

import { useReactFlow, useViewport } from '@xyflow/react';

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

	const matchedNodes = useMemo(() => {
		if (!debouncedFilter) return [];

		return debouncedNodes.filter((node) => {
			const nodeData = instructionNodes[node.data.type];

			return (
				nodeData.label.toLowerCase().includes(debouncedFilter) ||
				nodeData.category.includes(debouncedFilter) ||
				nodeData.items.some((item) => {
					if (item.type === 'label') {
						return item.value.toLowerCase().includes(debouncedFilter.toLowerCase());
					} else if (item.type === 'option') {
						return (
							item.name.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
							item.options.some((option) => option.toLowerCase().includes(debouncedFilter.toLowerCase()))
						);
					} else if (item.type === 'input') {
						return (
							item.value.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
							item.label?.toLowerCase().includes(debouncedFilter.toLowerCase())
						);
					}
				})
			);
		});
	}, [debouncedFilter, debouncedNodes]);

	return (
		<div className="p-2 space-y-2 h-full overflow-hidden">
			<Input placeholder="Search" value={filter} onChange={(event) => setFilter(event.currentTarget.value)} />
			<Divider />
			<section className="space-y-2 overflow-y-auto">
				{matchedNodes.map((node) => {
					const nodeData = instructionNodes[node.data.type];
					return (
						<div className="p-2 rounded-md border bg-secondary" key={node.id} onClick={() => handleClick(node)}>
							<div className="space-x-1 text-xs">
								<span>{Math.round(node.position.x)}</span>
								<span>{Math.round(node.position.y)}</span>
							</div>
							{nodeData.label}
						</div>
					);
				})}
			</section>
		</div>
	);
}
