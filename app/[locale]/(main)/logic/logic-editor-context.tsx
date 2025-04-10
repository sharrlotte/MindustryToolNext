import { createContext, useCallback, useContext, useState } from 'react';

import HelperLines from '@/app/[locale]/(main)/logic/helper-lines';
import InstructionNodeComponent, { InstructionNode } from '@/app/[locale]/(main)/logic/instruction.node';
import { getHelperLines } from '@/app/[locale]/(main)/logic/utils';

import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import { Edge, EdgeChange, NodeChange, ProOptions, ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges, useReactFlow } from '@xyflow/react';
import { InferStateType, ItemsType, NodeData } from '@/app/[locale]/(main)/logic/node';
import { groupBy, uuid } from '@/lib/utils';


export const nodeTypes = {
    instruction: InstructionNodeComponent,
} as const;

export type NodeType = keyof typeof nodeTypes;
export type Node = InstructionNode

const LogicEditorContext = createContext<LogicEditorContextType | null>(null);

export const instructionNodesGraph: Record<string, NodeData | { category: string, label: string, children: Record<string, NodeData> }> = {
    start: new NodeData({
        name: 'start',
        label: 'Start',
        color: '#6BB2B2',
        category: 'Special',
        items: [],
        inputs: 0,
        compile: () => '',
    }),

    end: new NodeData({
        name: 'end',
        label: 'End',
        color: '#6BB2B2',
        category: 'Special',
        items: [],
        inputs: 1,
        outputs: [],
        compile: () => '',
    }),
    if: new NodeData({
        name: 'if',
        label: 'Jump',
        category: 'Flow Control',
        color: '#6BB2B2',
        items: [
            {
                type: 'label',
                value: 'If',
            },
            {
                type: 'input',
                name: 'a',
                value: 'a',
                accept: ['number', 'string', 'boolean', 'variable'],
            },
            {
                type: 'option',
                name: 'condition',
                options: ['>', '>=', '<', '<=', '==', '===', 'not', 'always'],
            },
            {
                type: 'input',
                name: 'b',
                value: 'b',
                accept: ['number', 'string', 'boolean', 'variable'],
            },
        ] as const,
        inputs: 1,
        outputs: [
            { label: 'False', },
            { label: 'True', },
        ] as const,
        compile: ({ state: { condition, a, b }, next }) => `jump ${next.True?.data.index ?? 0} ${condition} ${a} ${b}`,
        condition: {
            a: (state) => state.condition !== 'always',
            b: (state) => state.condition !== 'always',
        },
    }),
    read: new NodeData({
        name: 'read',
        label: 'Read',
        category: 'Input/Output',
        color: '#A08A8A',
        items: [
            {
                type: 'input',
                label: 'Read',
                name: 'result',
                value: 'result',
                accept: ['string'],
                produce: true,
            },
            {
                type: 'input',
                label: '=',
                value: 'cell1',
                name: 'cell',
                accept: ['variable', 'string'],
            },
            {
                label: 'at',
                value: '0',
                name: 'position',
                type: 'input',
                accept: ['number', 'variable'],
            },
        ] as const,
        inputs: 1,
        compile: ({ state: { result, cell, position } }) => `read ${result} ${cell} ${position}`,
    }),
    write: new NodeData({
        name: 'write',
        label: 'Write',
        category: 'Input/Output',
        color: '#A08A8A',
        items: [
            {
                type: 'input',
                label: 'Write',
                name: 'result',
                value: 'result',
                accept: ['string'],
                produce: true,
            },
            {
                type: 'input',
                label: '=',
                value: 'cell1',
                name: 'cell',
                accept: ['variable', 'string'],
            },
            {
                label: 'at',
                value: '0',
                name: 'position',
                type: 'input',
                accept: ['number', 'variable'],
            },
        ] as const,
        inputs: 1,
        compile: ({ state: { result, cell, position } }) => `write ${result} ${cell} ${position}`,
    }),
    print: new NodeData({
        name: 'print',
        label: 'Print',
        category: 'Input/Output',
        color: '#A08A8A',
        items: [
            {
                type: 'input',
                label: 'Print',
                name: 'text',
                value: 'result',
                accept: ['string', 'variable'],
            },
        ] as const,
        inputs: 1,
        compile: ({ state }) => `print ${state.text}`,
    }),
    draw: {
        category: 'Input/Output',
        label: 'Draw',
        children: {
            clear: new NodeData({
                name: 'clear',
                label: 'Clear',
                category: 'Input/Output',
                color: '#A08A8A',
                items: [
                    {
                        type: 'input',
                        label: 'r',
                        name: 'r',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'g',
                        name: 'g',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'b',
                        name: 'b',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                ] as const,
                inputs: 1,
                compile: ({ state }) => `draw clear ${state.r} ${state.g} ${state.b} 0 0 0`,
            }),
            color: new NodeData({
                name: 'color',
                label: 'Color',
                category: 'Input/Output',
                color: '#A08A8A',
                items: [
                    {
                        type: 'input',
                        label: 'r',
                        name: 'r',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'g',
                        name: 'g',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'b',
                        name: 'b',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'a',
                        name: 'a',
                        value: '255',
                        accept: ['number', 'variable'],
                    },
                ] as const,
                inputs: 1,
                compile: ({ state: { r, g, b, a } }) => `draw color ${r} ${g} ${b} ${a} 0 0`,
            }),
            col: new NodeData({
                name: 'col',
                label: 'Col',
                category: 'Input/Output',
                color: '#A08A8A',
                items: [
                    {
                        type: 'input',
                        label: 'color',
                        name: 'color',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                ] as const,
                inputs: 1,
                compile: ({ state: { color } }) => `draw col ${color} 0 0 0 0 0`,
            }),
            stroke: new NodeData({
                name: 'stroke',
                label: 'Stroke',
                category: 'Input/Output',
                color: '#A08A8A',
                items: [
                    {
                        type: 'input',
                        label: 'stroke',
                        name: 'stroke',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                ] as const,
                inputs: 1,
                compile: ({ state: { stroke } }) => `draw stroke ${stroke} 0 0 0 0 0`,
            }),
            line: new NodeData({
                name: 'line',
                label: 'Line',
                category: 'Input/Output',
                color: '#A08A8A',
                items: [
                    {
                        type: 'input',
                        label: 'x',
                        name: 'x',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'y',
                        name: 'y',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'x2',
                        name: 'x2',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'y2',
                        name: 'y2',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                ] as const,
                inputs: 1,
                compile: ({ state: { x, y, x2, y2 } }) => `draw line ${x} ${y} ${x2} ${y2} 0 0`,
            }),
            rect: new NodeData({
                name: 'rect',
                label: 'Rect',
                category: 'Input/Output',
                color: '#A08A8A',
                items: [
                    {
                        type: 'input',
                        label: 'x',
                        name: 'x',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'y',
                        name: 'y',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'width',
                        name: 'width',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'height',
                        name: 'height',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                ] as const,
                inputs: 1,
                compile: ({ state: { x, y, width, height } }) => `draw rect ${x} ${y} ${width} ${height} 0 0`,
            }),
            lineRect: new NodeData({
                name: 'lineRect',
                label: 'LineRect',
                category: 'Input/Output',
                color: '#A08A8A',
                items: [
                    {
                        type: 'input',
                        label: 'x',
                        name: 'x',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'y',
                        name: 'y',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'width',
                        name: 'width',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'height',
                        name: 'height',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                ] as const,
                inputs: 1,
                compile: ({ state: { x, y, width, height } }) => `draw lineRect ${x} ${y} ${width} ${height} 0 0`,
            }),
            poly: new NodeData({
                name: 'poly',
                label: 'Poly',
                category: 'Input/Output',
                color: '#A08A8A',
                items: [
                    {
                        type: 'input',
                        label: 'x',
                        name: 'x',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'y',
                        name: 'y',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'sides',
                        name: 'sides',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'radius',
                        name: 'radius',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'rotation',
                        name: 'rotation',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                ] as const,
                inputs: 1,
                compile: ({ state: { x, y, sides, radius, rotation } }) => `draw poly ${x} ${y} ${sides} ${radius} ${rotation} 0`,
            }),
            linePoly: new NodeData({
                name: 'linePoly',
                label: 'LinePoly',
                category: 'Input/Output',
                color: '#A08A8A',
                items: [
                    {
                        type: 'input',
                        label: 'x',
                        name: 'x',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'y',
                        name: 'y',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'sides',
                        name: 'sides',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'radius',
                        name: 'radius',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'rotation',
                        name: 'rotation',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                ] as const,
                inputs: 1,
                compile: ({ state: { x, y, sides, radius, rotation } }) => `draw linePoly ${x} ${y} ${sides} ${radius} ${rotation} 0`,
            }),
            triangle: new NodeData({
                name: 'triangle',
                label: 'Triangle',
                category: 'Input/Output',
                color: '#A08A8A',
                items: [
                    {
                        type: 'input',
                        label: 'x',
                        name: 'x',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'y',
                        name: 'y',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'x2',
                        name: 'x2',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'y2',
                        name: 'y2',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'x3',
                        name: 'x3',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'y3',
                        name: 'y3',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                ] as const,
                inputs: 1,
                compile: ({ state: { x, y, x2, y2, x3, y3 } }) => `draw triangle ${x} ${y} ${x2} ${y2} ${x3} ${y3}`,
            }),
            image: new NodeData({
                name: 'image',
                label: 'Image',
                category: 'Input/Output',
                color: '#A08A8A',
                items: [
                    {
                        type: 'input',
                        label: 'x',
                        name: 'x',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'y',
                        name: 'y',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'image',
                        name: 'image',
                        value: '@copper',
                        accept: ['variable'],
                    },
                    {
                        type: 'input',
                        label: 'size',
                        name: 'size',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                    {
                        type: 'input',
                        label: 'rotation',
                        name: 'rotation',
                        value: '0',
                        accept: ['number', 'variable'],
                    },
                ] as const,
                inputs: 1,
                compile: ({ state: { x, y, image, size, rotation } }) => `draw image ${x} ${y} ${image} ${size} ${rotation} 0`,
            }),
        }
    }
} as const;



export const instructionNodes: Record<string, NodeData> = Object.entries(instructionNodesGraph).reduce((acc, [key, value]) => {
    if (value instanceof NodeData) {
        acc[key] = value;
    } else {
        Object.entries(value.children).forEach(([key, value]) => {
            acc[key] = value;
        });
    }

    return acc;
}, {} as Record<string, NodeData>);

export const nodeOptions = groupBy(Object.entries(instructionNodesGraph), (p) => p[1].category);


const initialNodes: Node[] = [
    {
        id: '7',
        data: {
            type: 'start',
            node: instructionNodes.start,
            state: instructionNodes.start.getDefaultState()
        },
        type: 'instruction',
        position: { x: 450, y: 500 },
    },
];

type LogicEditorContextType = {
    isDeleteOnClick: boolean;

    nodes: Node[];
    edges: Edge[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;

    setNodeState: (id: string, fn: (prev: InferStateType<ItemsType>) => InferStateType<ItemsType>) => void
    setNode: (id: string, fn: (prev: InstructionNode) => InstructionNode) => void

    actions: {
        undo: () => void;
        redo: () => void;
        addNode: (type: string) => void;
        toggleDeleteOnClick: () => void;
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
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [helperLineHorizontal, setHelperLineHorizontal] = useState<number | undefined>(undefined);
    const [helperLineVertical, setHelperLineVertical] = useState<number | undefined>(undefined);

    const [nodeHistory, setNodeHistory] = useState<Node[][]>([initialNodes]);
    const [edgeHistory, setEdgeHistory] = useState<Edge[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isDeleteOnClick, setDeleteOnClick] = useState(false);

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

    const findNode = useCallback((type: string) => nodes.find((node) => node.type === 'instruction' && node.data.type === type), [nodes]);

    const setNodeState = useCallback((id: string, fn: (prev: InferStateType<ItemsType>) => InferStateType<ItemsType>) => {
        const node = nodes.find((node) => node.id === id);

        if (node) {
            const newNode = { ...node, data: { ...node.data, state: fn(node.data.state) } };
            const newNodes = nodes.map((n) => (n.id === id ? newNode : n));
            setNodes(newNodes);
        }
    }, [nodes, setNodes])

    const setNode = useCallback((id: string, fn: (prev: InstructionNode) => InstructionNode) => {
        const node = nodes.find((node) => node.id === id);

        if (node) {
            const newNode = fn(node);
            const newNodes = nodes.map((n) => (n.id === id ? newNode : n));
            setNodes(newNodes);
        }
    }, [nodes, setNodes])


    const addNode = useCallback(
        (type: string) => {
            const position = screenToFlowPosition({ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 200 });
            if (type === 'start') {
                const target = findNode('start');
                if (target) {
                    toast.error(<Tran text="logic.only-one-start" />);
                    return;
                }
            }

            if (!(type in instructionNodes)) {
                toast.error(<span >{`Node not found: ${type}`}</span>);
                return;
            }

            const newNode: Node = {
                id: uuid(),
                type: 'instruction',
                data: { type, node: instructionNodes[type], state: instructionNodes[type].getDefaultState() },
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

    const undo = () => {
        if (historyIndex > 0) {
            const newHistoryIndex = historyIndex - 1;
            setNodes(nodeHistory[newHistoryIndex]);
            setEdges(edgeHistory[newHistoryIndex]);
            setHistoryIndex(newHistoryIndex);
        }
    };

    const redo = () => {
        if (historyIndex < nodeHistory.length - 1) {
            const newHistoryIndex = historyIndex + 1;
            setNodes(nodeHistory[newHistoryIndex]);
            setEdges(edgeHistory[newHistoryIndex]);
            setHistoryIndex(newHistoryIndex);
        }
    };
    return (
        <LogicEditorContext.Provider value={{ edges, nodes, setEdges, setNodes, setNodeState, setNode, isDeleteOnClick, actions: { redo, undo, addNode, toggleDeleteOnClick: () => setDeleteOnClick((prev) => !prev) } }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
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
            >
                {children}
                <HelperLines horizontal={helperLineHorizontal} vertical={helperLineVertical} />
            </ReactFlow>
        </LogicEditorContext.Provider>
    );
}
