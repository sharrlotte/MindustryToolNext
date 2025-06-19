'use client';

import { Identifier } from 'dnd-core';
import { UploadIcon } from 'lucide-react';
import { Suspense, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { createPortal } from 'react-dom';
import { useDebounceValue, useLocalStorage } from 'usehooks-ts';

import { WorkflowNode } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-node';
import WorkflowNodeComponent from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-node';
import HelperLines from '@/app/[locale]/logic/helper-lines';
import { getHelperLines } from '@/app/[locale]/logic/utils';

import { CatchError } from '@/components/common/catch-error';
import ErrorMessage from '@/components/common/error-message';
import Hydrated from '@/components/common/hydrated';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';

import { WorkflowNodeData } from '@/types/response/WorkflowContext';

import { getServerWorkflowVersion, loadServerWorkflow } from '@/query/server';

import useClientApi from '@/hooks/use-client';
import usePathId from '@/hooks/use-path-id';
import useWorkflowNodes from '@/hooks/use-workflow-nodes';

import { uuid } from '@/lib/utils';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
	Edge,
	EdgeChange,
	MarkerType,
	MiniMap,
	NodeChange,
	ProOptions,
	ReactFlow,
	ReactFlowInstance,
	Node as _BaseNode,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	useReactFlow,
	useViewport,
} from '@xyflow/react';

import dynamic from 'next/dynamic';

const PropertiesPanel = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/workflows/properties-panel'));

const WorkflowSideBar = dynamic(() => import('@/app/[locale]/(main)/servers/[id]/workflows/workflow-sidebar'));

type Node = WorkflowNode;

type LocalWorkflow = Record<
	string,
	{
		data: ReturnType<ReactFlowInstance<Node, Edge>['toObject']>;
		createdAt: number;
	}
>;

type WorkflowEditorContextType = {
	isDeleteOnClick: boolean;
	showMiniMap: boolean;
	showPropertiesPanel: WorkflowNode | null;
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
	setNode: (id: string, fn: (prev: Node) => Node) => void;

	actions: {
		undo: () => void;
		redo: () => void;
		addNode: (type: string) => void;
		toggleDeleteOnClick: () => void;
		setShowMiniMap: (show: boolean) => void;
		setShowPropertiesPanel: (node: WorkflowNode | null) => void;
	};
};

export const xyflowNodeTypes = {
	workflow: WorkflowNodeComponent,
} as const;

const WorkflowEditorContext = createContext<WorkflowEditorContextType | null>(null);

export const useWorkflowEditor = () => {
	const context = useContext(WorkflowEditorContext);

	if (!context) {
		throw new Error('useWorkflowEditor must be used within a WorkflowEditorProvider');
	}

	return context;
};

const proOptions: ProOptions = { hideAttribution: true };

const WORKFLOW_PERSISTENT_KEY = `workflows`;

export function WorkflowEditorProvider({ children }: { children: React.ReactNode }) {
	const id = usePathId();
	const [loadState, setLoadState] = useState<'loaded' | 'loading' | 'not-loaded'>('not-loaded');
	const [errors, setErrors] = useState<Record<string, any>>({});
	const [name, setName] = useState('');
	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);
	const [helperLineHorizontal, setHelperLineHorizontal] = useState<number | undefined>(undefined);
	const [helperLineVertical, setHelperLineVertical] = useState<number | undefined>(undefined);
	const [rfInstance, setRfInstance] = useState<ReactFlowInstance<Node, Edge> | null>(null);
	const [nodeHistory, setNodeHistory] = useState<Node[][]>([]);
	const [edgeHistory, setEdgeHistory] = useState<Edge[][]>([[]]);
	const [historyIndex, setHistoryIndex] = useState(0);

	const [isDeleteOnClick, setDeleteOnClick] = useState(false);
	const [showMiniMap, setShowMiniMap] = useLocalStorage('workflow.editor.show-mini-map', false);
	const [showPropertiesPanel, setShowPropertiesPanel] = useState<WorkflowNode | null>(null);

	const { setViewport } = useReactFlow();
	const ref = useRef<HTMLDivElement>(null);
	const viewport = useViewport();
	const { data: nodeTypes } = useWorkflowNodes();

	const [debouncedNodes] = useDebounceValue(nodes, 1000);
	const [debouncedEdges] = useDebounceValue(edges, 1000);

	useEffect(() => {
		if (loadState !== 'loaded') {
			return;
		}
		try {
			if (rfInstance) {
				const flow = JSON.parse(localStorage.getItem(WORKFLOW_PERSISTENT_KEY) || '{}') as LocalWorkflow;
				const data: LocalWorkflow = { ...flow, [id]: { createdAt: Date.now(), data: rfInstance.toObject() } };
				console.dir({ save: data });
				localStorage.setItem(WORKFLOW_PERSISTENT_KEY, JSON.stringify(data));
			}
		} catch (e) {
			setErrors((prev) => ({ ...prev, 'save-error': e }));
			console.error('Error saving workflow', e);
		}
	}, [rfInstance, id, debouncedEdges, debouncedNodes, loadState]);

	useEffect(() => {
		if (!nodeTypes || Object.keys(nodeTypes).length === 0 || loadState !== 'not-loaded') {
			return;
		}

		try {
			console.log('Loading workflow');
			setLoadState('loading');

			const result = JSON.parse(localStorage.getItem(WORKFLOW_PERSISTENT_KEY) ?? '{}') as LocalWorkflow;
			const data = result[id]?.data;

			console.dir({ load: data });

			if (!data) {
				console.log('No workflow data');
				setLoadState('loaded');
				return;
			}

			const { x = viewport.x, y = viewport.y, zoom = viewport.zoom } = data.viewport;
			const nodes = data.nodes ?? [];
			const edges = data.edges ?? [];

			setNodes(
				nodes.filter((node) => {
					const base = nodeTypes[node.data.name];

					if (!base) {
						console.warn('Invalid node name: ' + node.data.name);
						return false;
					}

					if (node.data.color !== base.color) {
						node.data.color = base.color;
					}

					if (node.data.group !== base.group) {
						node.data.group = base.group;
					}

					if (node.data.inputs !== base.inputs) {
						node.data.inputs = base.inputs;
					}

					if (
						node.data.outputs.length !== base.outputs.length ||
						node.data.outputs.some((output) => base.outputs.find((baseOutput) => output.name === baseOutput.name) === undefined)
					) {
						node.data.outputs = base.outputs;
					}

					if (
						node.data.consumers.length !== base.consumers.length ||
						node.data.consumers.some(
							(consumer) => base.consumers.find((baseConsumer) => consumer.name === baseConsumer.name) === undefined,
						)
					) {
						node.data.consumers = base.consumers;
					}

					if (
						node.data.producers.length !== base.producers.length ||
						node.data.producers.some(
							(producer) => base.producers.find((baseProducer) => producer.name === baseProducer.name) === undefined,
						)
					) {
						node.data.producers = base.producers;
					}

					for (const consumer of node.data.consumers) {
						const baseConsumer = base.consumers.find((c) => c.name === consumer.name);

						if (baseConsumer) {
							consumer.options = baseConsumer.options;
						}
					}

					return true;
				}),
			);
			setEdges(edges);
			setViewport({ x, y, zoom }, { duration: 1000 });
			console.log('Workflow loaded');
		} catch (error) {
			setErrors((prev) => ({ ...prev, 'load-error': error }));
			console.error('Error parsing workflow data from localStorage:', error);
		} finally {
			setLoadState('loaded');
		}
	}, [id, viewport, nodeTypes, setViewport, loadState]);

	const variables = useMemo(
		() =>
			// debouncedNodes
			// 	.filter((node) => {
			// 		if (node.type !== 'workflow') return false;

			// 		const nodeData = workflowNodes[node.data.type];
			// 		return nodeData.items.some((input) => input.type === 'input' && input.produce);
			// 	}) //
			// 	.reduce((prev, node) => {
			// 		const nodeData = workflowNodes[node.data.type];
			// 		const entry = (
			// 			nodeData.items.filter((input) => input.type === 'input' && input.produce === true) as InputItem<string, string>[]
			// 		).map((input) => [input.name + node.id, node.data.state[input.name]]);
			// 		return { ...prev, ...Object.fromEntries(entry) };
			// 	}, {}),
			({}),
		[],
	);

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
		(name: string) => nodes.find((node) => node.type === 'workflow' && node.data.name === name),
		[nodes],
	);

	const setNode = useCallback(
		(id: string, fn: (prev: Node) => Node) => {
			const newNodes = nodes.map((n) => (n.id === id ? fn(n) : n));
			setNodes(newNodes);
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
					toast.error(<Tran text="workflow.only-one-start" />);
					return;
				}
			}

			const node = nodeTypes[type];

			if (!node) {
				toast.error(`Node not found: ${type}`);
				return;
			}

			const copy = JSON.parse(JSON.stringify(node)) as WorkflowNodeData;

			copy.consumers.forEach((consumer) => {
				if (consumer.defaultValue) {
					consumer.value = consumer.defaultValue;
				}
			});

			copy.id = uuid();

			const newNode: Node = {
				...copy,
				id: copy.id,
				type: 'workflow',
				data: copy,
				position,
			};

			const newNodes = [...nodes, newNode];

			setNodes(newNodes);
			updateHistory(newNodes, edges);
		},
		[screenToFlowPosition, nodeTypes, nodes, updateHistory, edges, findNode],
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
			const newEdges = addEdge(
				{
					...params,
					animated: true,
					markerEnd: {
						type: MarkerType.Arrow,
					},
				},
				edges,
			);
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

			if (node.type === 'workflow') {
				setShowPropertiesPanel((prev) => (prev?.id === node.id ? null : node));
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
			redo,
			undo,
			addNode,
			setShowPropertiesPanel,
			toggleDeleteOnClick: () => setDeleteOnClick((prev) => !prev),
			setShowMiniMap,
		}),
		[redo, undo, addNode, setShowMiniMap],
	);

	const [{ handlerId }, drop] = useDrop<any, void, { handlerId: Identifier | null }>({
		accept: 'workflow',
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
		<WorkflowEditorContext.Provider
			value={{
				name,
				setName,
				variables,
				edges,
				nodes,
				debouncedNodes,
				debouncedEdges,
				showMiniMap,
				showPropertiesPanel,
				canUndo: historyIndex > 0,
				canRedo: historyIndex < nodeHistory.length - 1,
				setEdges,
				setNodes,
				setNode,
				isDeleteOnClick,
				actions,
			}}
		>
			<CatchError>
				<Suspense>
					<WorkflowSideBar />
				</Suspense>
			</CatchError>
			<ReactFlow
				className="h-full w-full"
				ref={ref}
				nodes={nodes}
				edges={edges}
				onInit={setRfInstance}
				onNodesChange={onNodeChange}
				onEdgesChange={onEdgeChange}
				onConnect={onEdgeConnect}
				onNodesDelete={onNodesDelete}
				onEdgesDelete={onEdgesDelete}
				nodeTypes={xyflowNodeTypes}
				onNodeClick={onNodeClick}
				onEdgeClick={onEdgeClick}
				onNodeContextMenu={onNodeContextMenu}
				onEdgeContextMenu={onEdgeContextMenu}
				onNodeDragStop={onNodeDragStop}
				proOptions={proOptions}
				fitView
				data-handler-id={handlerId}
			>
				<CatchError>
					<Suspense>
						{children}
						<HelperLines horizontal={helperLineHorizontal} vertical={helperLineVertical} />
						<Hydrated>{showMiniMap && <MiniMap />}</Hydrated>
						<p className="absolute z-50 top-1 left-0 right-0 w-1/2 translate-x-1/2 flex justify-center text-xs text-destructive-foreground">
							{Object.entries(errors)
								.map(([key, value]) => `${key.toUpperCase()}: ${value.message}`)
								.join()}
						</p>
						<div className="absolute z-50 bottom-0 top-0 right-1 p-1 space-x-1 flex text-sm text-muted-foreground">
							<span>x: {Math.round(viewport.x)}</span>
							<span>y: {Math.round(viewport.y)}</span>
							<Suspense>
								<UploadContextButton />
							</Suspense>
						</div>
					</Suspense>
				</CatchError>
			</ReactFlow>
			<Suspense>{showPropertiesPanel && <PropertiesPanel node={showPropertiesPanel} />}</Suspense>
		</WorkflowEditorContext.Provider>
	);
}

function UploadContextButton() {
	const id = usePathId();
	const axios = useClientApi();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['server', id, 'workflow', 'version'],
		queryFn: () => getServerWorkflowVersion(axios, id),
	});

	const serverVersion = data ?? 0;

	const result = JSON.parse(localStorage.getItem(WORKFLOW_PERSISTENT_KEY) ?? '{}') as LocalWorkflow;
	const localVersion = result[id]?.createdAt ?? 0;

	if (isLoading) {
		return undefined;
	}

	if (isError) {
		return <ErrorMessage error={error} />;
	}

	const container = document.getElementById('server-nav-right');

	if (!container) {
		throw new Error('Server nav right container not found');
	}

	return (
		<div>
			{serverVersion > localVersion && <span className="text-destructive-foreground">Your local version is outdated</span>}
			{serverVersion !== localVersion &&
				createPortal(
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="primary">
								<UploadIcon className="size-4" />
								<span>Load workflow</span>
							</Button>
						</DialogTrigger>
						<DialogContent className="p-6 border rounded-dm">
							<DialogTitle>Confirm</DialogTitle>
							<UploadWorkflowDialog version={localVersion} />
						</DialogContent>
					</Dialog>,
					container,
				)}
		</div>
	);
}

function UploadWorkflowDialog({ version }: { version: number }) {
	const id = usePathId();
	const axios = useClientApi();

	const { nodes } = useWorkflowEditor();
	const payload = useMemo(() => {
		const result = nodes.filter((node) => node.type === 'workflow').map((node) => JSON.parse(JSON.stringify(node.data)));

		return {
			nodes: result,
			createdAt: version,
		};
	}, [nodes, version]);

	const { mutate, isPending } = useMutation({
		mutationKey: ['server', id, 'workflow', 'load'],
		mutationFn: () => loadServerWorkflow(axios, id, payload),
		onMutate: () => toast.loading(<Tran text="upload.loading" />),
		onSuccess: (_data, _variables, id) => toast.success(<Tran text="upload.success" />, { id }),
		onError: (error, _variables, id) => toast.error(<Tran text="upload.fail" />, { error, id }),
	});

	return (
		<>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant="secondary">Cancel</Button>
				</DialogClose>
				<DialogClose asChild>
					<Button onClick={() => mutate()} disabled={isPending || !payload} variant="primary">
						Ok
					</Button>
				</DialogClose>
			</DialogFooter>
		</>
	);
}
