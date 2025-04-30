'use client';

import { useMemo, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';

import { NodeData, instructionNodes } from '@/app/[locale]/logic/node';

import Tran from '@/components/common/tran';
import { Input } from '@/components/ui/input';

import { groupBy } from '@/lib/utils';

export default function PlusPanel() {
	return <InstructionList />;
}

function InstructionList() {
	const [filter, setFilter] = useState('');

	const nodeGroups = useMemo(
		() =>
			groupBy(
				Object.values(instructionNodes).filter(({ name }) => name.includes(filter)),
				(k) => k.category,
			),
		[filter],
	);

	return (
		<div className="space-y-4 flex flex-col h-full overflow-hiden">
			<div>
				<h2 className="text-base">
					<Tran text="logic.instruction-list" defaultValue="Instruction list" />
				</h2>
				<Input placeholder="Search" value={filter} onChange={(event) => setFilter(event.currentTarget.value)} />
			</div>
			<section className="h-full overflow-y-auto pr-2">
				{nodeGroups.map((group) => (
					<InstructionGroup key={group.key} group={group} />
				))}
			</section>
		</div>
	);
}

function InstructionGroup({ group: { key, value } }: { group: { key: string; value: NodeData[] } }) {
	return (
		<div className="space-y-2">
			<h3 className="text-base capitalize">{key}</h3>
			{value.map((node) => (
				<InstructionItem key={node.name} item={node} />
			))}
		</div>
	);
}

function InstructionItem({ item: { name, color } }: { item: NodeData }) {
	const ref = useRef<HTMLDivElement>(null);

	const [_, drag] = useDrag({
		type: 'instruction',
		item: () => {
			return { id: name };
		},
		collect: (monitor: any) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	drag(ref);

	return (
		<div className="text-white p-2 border rounded-md capitalize" style={{ backgroundColor: color }} ref={ref}>
			{name}
		</div>
	);
}
