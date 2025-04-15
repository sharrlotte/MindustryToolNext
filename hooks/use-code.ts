import { useMemo } from 'react';

import { InstructionNode } from '@/app/[locale]/logic/instruction.node';
import { useLogicEditor } from '@/app/[locale]/logic/logic-editor.context';
import { Output } from '@/app/[locale]/logic/node';

export default function useCode() {
	const { nodes, edges } = useLogicEditor();

	return useMemo(() => {
		const visited: string[] = [];
		const lines: string[] = [];
		let index = 0;

		const start = nodes.find((node) => node.type === 'instruction' && node.data.type === 'start');

		if (!start) {
			return lines;
		}
		const startEdge = edges.find((edge) => edge.source === start.id);

		if (!startEdge) {
			return lines;
		}

		let nextNode: undefined | InstructionNode = nodes.find((node) => node.type === 'instruction' && node.id === startEdge.target);

		if (!nextNode) {
			return lines;
		}

		const queue = [nextNode];

		function findNextNodes(node: InstructionNode): Record<string, InstructionNode> {
			const edge = edges.filter((edge) => edge.source === node.id);
			const edgeId = edge.map((e) => e.target);

			if (!edge) return {};

			const nextNode = nodes.filter((node) => node.type === 'instruction' && edgeId.includes(node.id));

			function getEdgeIndex(target: InstructionNode) {
				const result = edge.find((e) => e.target === target.id);

				if (!result) throw new Error('Edge not found');

				if (node.data.node === undefined) {
					throw new Error('Node not found');
				}

				const index = node.data.node.outputs.findIndex((o) => o.label === result.label);

				if (index === -1) {
					return undefined;
				}

				const output = node.data.node.outputs[index];

				return { index, output, target };
			}

			const sorted = nextNode
				.reduce<
					{
						index: number;
						output: Output;
						target: InstructionNode;
					}[]
				>((prev, curr) => {
					const r = getEdgeIndex(curr);

					if (r) {
						prev.push(r);
					}

					return prev;
				}, [])
				.sort((a, b) => b.index - a.index);

			const initial: Record<string, InstructionNode> = {};

			return sorted.reduce<Record<string, InstructionNode>>((prev, curr) => {
				prev[curr.output.label] = curr.target;

				return prev;
			}, initial);
		}

		while (nextNode) {
			nextNode = queue.pop();

			if (!nextNode) break;

			if (visited.includes(nextNode.id)) {
				lines.push(`jump ${nextNode.data.index} always a b`);
			} else {
				visited.push(nextNode.id);
				lines.push(nextNode.data.node.compile({ state: nextNode.data.state, next: findNextNodes(nextNode) }));
				nextNode.data.index = index;
				index++;
				queue.push(...Object.values(findNextNodes(nextNode)));
			}
		}

		return lines;
	}, [edges, nodes]);
}
