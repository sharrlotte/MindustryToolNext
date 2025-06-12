'use client';

import { Identifier } from 'dnd-core';
import dynamic from 'next/dynamic';
import { Suspense, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDebounceValue, useLocalStorage } from 'usehooks-ts';

import HelperLines from '@/app/[locale]/logic/helper-lines';
import InstructionNodeComponent, { InstructionNode } from '@/app/[locale]/logic/instruction.node';
import LiveCodePanel from '@/app/[locale]/logic/live-code-panel';
import { InferStateType, InputItem, ItemsType, initialNodes, instructionNodes } from '@/app/[locale]/logic/node';
import SideBar from '@/app/[locale]/logic/sidebar';
import ToolBar from '@/app/[locale]/logic/toolbar';
import { getHelperLines } from '@/app/[locale]/logic/utils';

import { CatchError } from '@/components/common/catch-error';
import Hydrated from '@/components/common/hydrated';
import LoadingSpinner from '@/components/common/loading-spinner';
import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import useLogicFile from '@/hooks/use-logic-file';
import { uuid } from '@/lib/utils';

import {
	Edge,
	EdgeChange,
	MiniMap,
	NodeChange,
	ProOptions,
	ReactFlow,
	ReactFlowInstance,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	useReactFlow,
	useViewport,
} from '@xyflow/react';

const NoFileOpenScreen = dynamic(() => import('@/app/[locale]/logic/no-file-open-screen'));

export const nodeTypes = {
	instruction: InstructionNodeComponent,
} as const;

export type NodeType = keyof typeof nodeTypes;
export type Node = InstructionNode;

const LogicEditorContext = createContext<LogicEditorContextType | null>(null);

type LogicEditorContextType = {
	isDeleteOnClick: boolean;
	showAddNodeDialog: boolean;
	showMiniMap: boolean;
	showLiveCode: boolean;
	canUndo: boolean;
	canRedo: boolean;
	name: string;

	variables: Record<string, string>;

	nodes: Node[];
	edges: Edge[];
	debouncedNodes: Node[];
	debouncedEdges: Edge[];
	setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
	setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
	setName: (name: string) => void;
	setNodeState: (id: string, fn: (prev: InferStateType<ItemsType>) => InferStateType<ItemsType>) => void;
	setNode: (id: string, fn: (prev: InstructionNode) => InstructionNode) => void;

	actions: {
		save: () => void;
		load: (name: string) => boolean;
		undo: () => void;
		redo: () => void;
		addNode: (type: string) => void;
		toggleDeleteOnClick: () => void;
		setShowAddNodeDialog: (show: boolean) => void;
		setShowMiniMap: (show: boolean) => void;
		setShowLiveCode: (show: boolean) => void;
	};
};

export const useLogicEditor = () => {
	const context = useContext(LogicEditorContext);

	if (!context) {
		throw new Error('useLogicEditor must be used within a LogicEditorProvider');
	}

	return context;
};

const proOptions: ProOptions = { hideAttribution: true };

export function LogicEditorProvider({ children }: { children: React.ReactNode }) {
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState('');
	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>([]);
	const [helperLineHorizontal, setHelperLineHorizontal] = useState<number | undefined>(undefined);
	const [helperLineVertical, setHelperLineVertical] = useState<number | undefined>(undefined);
	const [rfInstance, setRfInstance] = useState<ReactFlowInstance<InstructionNode, Edge> | null>(null);
	const [nodeHistory, setNodeHistory] = useState<Node[][]>([initialNodes]);
	const [edgeHistory, setEdgeHistory] = useState<Edge[][]>([[]]);
	const [historyIndex, setHistoryIndex] = useState(0);
	const [isDeleteOnClick, setDeleteOnClick] = useState(false);
	const [showAddNodeDialog, setShowAddNodeDialog] = useState(false);
	const [showMiniMap, setShowMiniMap] = useLocalStorage('logic.editor.showMiniMap', false);
	const [showLiveCode, setShowLiveCode] = useLocalStorage('logic.editor.showLiveCode', false);
	const { setViewport } = useReactFlow();
	const ref = useRef<HTMLDivElement>(null);
	const viewport = useViewport();
	const { saved } = useLogicFile();
	const { readLogicFromLocalStorageByName, writeLogicToLocalStorage } = useLogicFile();

	const [debouncedNodes] = useDebounceValue(nodes, 1000);
	const [debouncedEdges] = useDebounceValue(edges, 1000);

	const variables = useMemo(
		() =>
			debouncedNodes
				.filter((node) => {
					if (node.type !== 'instruction') return false;

					const nodeData = instructionNodes[node.data.type];
					return nodeData.items.some((input) => input.type === 'input' && input.produce);
				}) //
				.reduce((prev, node) => {
					const nodeData = instructionNodes[node.data.type];
					const entry = (
						nodeData.items.filter((input) => input.type === 'input' && input.produce === true) as InputItem<string, string>[]
					).map((input) => [input.name + node.id, node.data.state[input.name]]);
					return { ...prev, ...Object.fromEntries(entry) };
				}, {}),
		[debouncedNodes],
	);

	const save = useCallback(() => {
		if (!rfInstance) {
			return;
		}

		if (!name) {
			toast.error(<Tran text="logic.file-name-is-required" />);
			return;
		}

		const data = rfInstance.toObject();
		writeLogicToLocalStorage(name, data);
	}, [rfInstance, name, writeLogicToLocalStorage]);

	useEffect(() => {
		save();
	}, [debouncedEdges, debouncedNodes, save]);

	const load = useCallback(
		(name: string) => {
			try {
				setLoading(true);
				const data = readLogicFromLocalStorageByName(name);

				if (!data) {
					toast.error(<Tran text="logic.file-not-found" />, { description: name });
					return false;
				}

				const { x = 0, y = 0, zoom = 1 } = data.viewport;
				setNodes(data.nodes || []);
				setEdges(data.edges || []);
				setViewport({ x, y, zoom });
				setName(name);

				return true;
			} catch (e) {
				return false;
			} finally {
				setLoading(false);
			}
		},
		[readLogicFromLocalStorageByName, setViewport],
	);

	useEffect(() => {
		if (saved.currentFile) {
			load(saved.currentFile);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { screenToFlowPosition } = useReactFlow();

	const updateHistory = useCallback(
		(newNodes: Node[], newEdges: Edge[]) => {
			const newHistoryIndex = historyIndex + 1;
			setNodeHistory((prev) => [...prev.slice(0, newHistoryIndex), newNodes]);
			setEdgeHistory((prev) => [...prev.slice(0, newHistoryIndex), newEdges]);
			setHistoryIndex(newHistoryIndex);
		},
		[historyIndex],
	);

	const findNode = useCallback(
		(type: string) => nodes.find((node) => node.type === 'instruction' && node.data.type === type),
		[nodes],
	);

	const setNodeState = useCallback(
		(id: string, fn: (prev: InferStateType<ItemsType>) => InferStateType<ItemsType>) => {
			const node = nodes.find((node) => node.id === id);

			if (node) {
				const newNode = { ...node, data: { ...node.data, state: fn(node.data.state) } };
				const newNodes = nodes.map((n) => (n.id === id ? newNode : n));
				setNodes(newNodes);
			}
		},
		[nodes, setNodes],
	);

	const setNode = useCallback(
		(id: string, fn: (prev: InstructionNode) => InstructionNode) => {
			const node = nodes.find((node) => node.id === id);

			if (node) {
				const newNode = fn(node);
				const newNodes = nodes.map((n) => (n.id === id ? newNode : n));
				setNodes(newNodes);
			}
		},
		[nodes, setNodes],
	);

	const addNode = useCallback(
		(type: string, p?: { x: number; y: number } | undefined | null) => {
			const position = screenToFlowPosition({
				x: p?.x ?? window.innerWidth / 2 - 200,
				y: p?.y ?? window.innerHeight / 2 - 200,
			});

			if (type === 'start') {
				const target = findNode('start');
				if (target) {
					toast.error(<Tran text="logic.only-one-start" />);
					return;
				}
			}

			if (!(type in instructionNodes)) {
				toast.error(<span>{`Node not found: ${type}`}</span>);
				return;
			}

			const newNode: Node = {
				id: uuid(),
				type: 'instruction',
				data: {
					type,
					state: instructionNodes[type].getDefaultState(),
				},
				position,
			};
			const newNodes = [...nodes, newNode];
			setNodes(newNodes);
			updateHistory(newNodes, edges);
		},
		[screenToFlowPosition, nodes, updateHistory, edges, findNode],
	);

	const customApplyNodeChanges = useCallback((changes: NodeChange[], nodes: Node[]): Node[] => {
		setHelperLineHorizontal(undefined);
		setHelperLineVertical(undefined);

		if (changes.length === 1 && changes[0].type === 'position' && changes[0].dragging && changes[0].position) {
			const helperLines = getHelperLines(changes[0], nodes);

			changes[0].position.x = helperLines.snapPosition.x ?? changes[0].position.x;
			changes[0].position.y = helperLines.snapPosition.y ?? changes[0].position.y;

			setHelperLineHorizontal(helperLines.horizontal);
			setHelperLineVertical(helperLines.vertical);
		}

		return applyNodeChanges(changes, nodes) as unknown as any;
	}, []);

	const onNodeChange = useCallback(
		(changes: NodeChange[]) => {
			const newNodes = customApplyNodeChanges(changes, nodes);
			setNodes(newNodes);
		},
		[customApplyNodeChanges, nodes],
	);

	const onEdgeChange = useCallback(
		(changes: EdgeChange[]) => {
			const newEdges = applyEdgeChanges(changes, edges);
			setEdges(newEdges);
			updateHistory(nodes, newEdges);
		},
		[edges, updateHistory, nodes],
	);

	const onEdgeConnect = useCallback(
		(params: any) => {
			const newEdges = addEdge({ ...params, animated: true }, edges);
			setEdges(newEdges);
			updateHistory(nodes, newEdges);
		},
		[edges, updateHistory, nodes],
	);

	const onNodesDelete = useCallback(
		(deleted: Node[]) => {
			const newNodes = nodes.filter((node) => !deleted.some((d) => d.id === node.id));
			const newEdges = edges.filter((edge) => !deleted.some((d) => d.id === edge.source || d.id === edge.target));
			setNodes(newNodes);
			setEdges(newEdges);
			updateHistory(newNodes, newEdges);
		},
		[nodes, edges, updateHistory],
	);

	const onEdgesDelete = useCallback(
		(deleted: Edge[]) => {
			const newEdges = edges.filter((edge) => !deleted.some((d) => d.id === edge.id));
			setEdges(newEdges);
			updateHistory(nodes, newEdges);
		},
		[edges, updateHistory, nodes],
	);

	const onNodeClick = useCallback(
		(_event: React.MouseEvent, node: Node) => {
			if (isDeleteOnClick) {
				const newNodes = nodes.filter((n) => n.id !== node.id);
				const newEdges = edges.filter((e) => e.source !== node.id && e.target !== node.id);
				setNodes(newNodes);
				setEdges(newEdges);
				updateHistory(newNodes, newEdges);
			}
		},
		[isDeleteOnClick, nodes, edges, updateHistory],
	);

	const onEdgeClick = useCallback(
		(event: React.MouseEvent, edge: Edge) => {
			event.preventDefault();
			if (isDeleteOnClick) {
				const newEdges = edges.filter((e) => e.id !== edge.id);
				setEdges(newEdges);
				updateHistory(nodes, newEdges);
			}
		},
		[isDeleteOnClick, edges, updateHistory, nodes],
	);

	const onNodeContextMenu = useCallback(
		(event: React.MouseEvent, node: Node) => {
			event.preventDefault();
			if (!isDeleteOnClick) {
				const newNodes = nodes.filter((n) => n.id !== node.id);
				const newEdges = edges.filter((e) => e.source !== node.id && e.target !== node.id);
				setNodes(newNodes);
				setEdges(newEdges);
				updateHistory(newNodes, newEdges);
			}
		},
		[isDeleteOnClick, nodes, edges, updateHistory],
	);

	const onEdgeContextMenu = useCallback(
		(event: React.MouseEvent, edge: Edge) => {
			event.preventDefault();
			if (!isDeleteOnClick) {
				const newEdges = edges.filter((e) => e.id !== edge.id);
				setEdges(newEdges);
				updateHistory(nodes, newEdges);
			}
		},
		[isDeleteOnClick, edges, updateHistory, nodes],
	);

	const onNodeDragStop = useCallback(
		(_event: React.MouseEvent, node: Node) => {
			const newNodes = nodes.map((n) => (n.id === node.id ? { ...n, position: node.position } : n));
			setNodes(newNodes);
			updateHistory(newNodes, edges);
		},
		[nodes, updateHistory, edges],
	);

	const undo = useCallback(() => {
		if (historyIndex > 0) {
			const newHistoryIndex = historyIndex - 1;
			setNodes(nodeHistory[newHistoryIndex]);
			setEdges(edgeHistory[newHistoryIndex]);
			setHistoryIndex(newHistoryIndex);
		}
	}, [historyIndex, nodeHistory, edgeHistory]);

	const redo = useCallback(() => {
		if (historyIndex < nodeHistory.length - 1) {
			const newHistoryIndex = historyIndex + 1;
			setNodes(nodeHistory[newHistoryIndex]);
			setEdges(edgeHistory[newHistoryIndex]);
			setHistoryIndex(newHistoryIndex);
		}
	}, [historyIndex, nodeHistory, edgeHistory]);

	const actions = useMemo(
		() => ({
			save,
			load,
			redo,
			undo,
			addNode,
			setShowAddNodeDialog,
			toggleDeleteOnClick: () => setDeleteOnClick((prev) => !prev),
			setShowMiniMap,
			setShowLiveCode,
		}),
		[save, load, redo, undo, addNode, setShowMiniMap, setShowLiveCode],
	);

	const [{ handlerId }, drop] = useDrop<any, void, { handlerId: Identifier | null }>({
		accept: 'instruction',
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			};
		},
		drop: (item, monitor) => {
			const position = monitor.getClientOffset();
			addNode(item.id, position);
		},
	});

	drop(ref);

	return (
		<LogicEditorContext.Provider
			value={{
				name,
				setName,
				variables,
				edges,
				nodes,
				debouncedNodes,
				debouncedEdges,
				showAddNodeDialog,
				showMiniMap,
				showLiveCode,
				canUndo: historyIndex > 0,
				canRedo: historyIndex < nodeHistory.length - 1,
				setEdges,
				setNodes,
				setNodeState,
				setNode,
				isDeleteOnClick,
				actions,
			}}
		>
			<CatchError>
				<Suspense>
					<SideBar />
				</Suspense>
			</CatchError>
			<div className="grid grid-rows-[auto_1fr]">
				<Suspense>
					<CatchError>
						<ToolBar />
					</CatchError>
				</Suspense>
				<CatchError>
					{loading ? (
						<LoadingSpinner />
					) : name === '' ? (
						<NoFileOpenScreen />
					) : (
						<ReactFlow
							ref={ref}
							nodes={nodes}
							edges={edges}
							onInit={setRfInstance}
							onNodesChange={onNodeChange}
							onEdgesChange={onEdgeChange}
							onConnect={onEdgeConnect}
							onNodesDelete={onNodesDelete}
							onEdgesDelete={onEdgesDelete}
							nodeTypes={nodeTypes}
							onNodeClick={onNodeClick}
							onEdgeClick={onEdgeClick}
							onNodeContextMenu={onNodeContextMenu}
							onEdgeContextMenu={onEdgeContextMenu}
							onNodeDragStop={onNodeDragStop}
							proOptions={proOptions}
							fitView
							data-handler-id={handlerId}
						>
							<Suspense>
								{children}
								<div className="absolute z-50 top-1 left-1 space-x-1 text-xs text-muted-foreground">
									<span>x: {Math.round(viewport.x)}</span>
									<span>y: {Math.round(viewport.y)}</span>
								</div>
								<HelperLines horizontal={helperLineHorizontal} vertical={helperLineVertical} />
								<Hydrated>
									{showLiveCode && <LiveCodePanel />}
									{showMiniMap && <MiniMap />}
								</Hydrated>
							</Suspense>
						</ReactFlow>
					)}
				</CatchError>
			</div>
		</LogicEditorContext.Provider>
	);
}
