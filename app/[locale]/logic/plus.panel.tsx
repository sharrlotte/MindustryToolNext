import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { instructionNodes } from '@/app/[locale]/logic/node';

import { groupBy } from '@/lib/utils';

export default function PlusPanel() {
	return (
		<DndProvider backend={HTML5Backend}>
			<InstructionList />
		</DndProvider>
	);
}

const nodeGroups = groupBy(Object.values(instructionNodes), (k) => k.category);

function InstructionList() {
	return (
		<div>
			{nodeGroups.map((group) => (
				<InstructionGroup key={group.key} group={group} />
			))}
		</div>
	);
}

function InstructionGroup({ group: { key, value } }: { group: (typeof nodeGroups)[number] }) {
	return (
		<div>
			<h3>{key}</h3>
			{value.map((node) => (
				<InstructionItem key={node.name} item={node} />
			))}
		</div>
	);
}

function InstructionItem({ item: { name } }: { item: (typeof nodeGroups)[number]['value'][number] }) {
	return <div>{name}</div>;
}
