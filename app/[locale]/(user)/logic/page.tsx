'use client';

import { useCallback, useMemo, useState } from 'react';
import ReactFlow, { Background, Controls, Edge, EdgeChange, MiniMap, Node, NodeChange, ProOptions, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

import useToggle from '@/hooks/use-state-toggle';
import { useToast } from '@/hooks/use-toast';
import Modal from '@/layout/modal';
import { cn } from '@/lib/utils';

import { SmartBezierEdge } from '@tisoap/react-flow-smart-edge';

import HelperLines from './HelperLines';
import initialEdges from './edge';
import {
  ControlNode,
  DrawFlushNode,
  DrawNode,
  EndNode,
  GetLinkNode,
  JumpNode,
  LookUpNode,
  OperationNode,
  PackColorNode,
  PrintFlushNode,
  PrintNode,
  RadarNode,
  ReadNode,
  SensorNode,
  SetNode,
  StopNode,
  TextUpdaterNode,
  UnitBindNode,
  UnitControlNode,
  UnitLocateNode,
  UnitRadarNode,
  WaitNode,
  WriteNode,
} from './nodes/NodeTypes';
import initialNodes from './nodes/nodes';
import './style.css';
import { getHelperLines } from './utils';

const proOptions: ProOptions = { account: 'paid-pro', hideAttribution: true };

const edgeTypes = {
  smart: SmartBezierEdge,
};

const nodeTypes = {
  textUpdater: TextUpdaterNode,
  waitNode: WaitNode,
  stopNode: StopNode,
  endNode: EndNode,
  jumpNode: JumpNode,
  setNode: SetNode,
  operationNode: OperationNode,
  lookUpNode: LookUpNode,
  packColorNode: PackColorNode,
  sensorNode: SensorNode,
  controlNode: ControlNode,
  radarNode: RadarNode,
  printFlushNode: PrintFlushNode,
  drawFlushNode: DrawFlushNode,
  getLinkNode: GetLinkNode,
  unitBindNode: UnitBindNode,
  unitControlNode: UnitControlNode,
  unitRadarNode: UnitRadarNode,
  unitLocateNode: UnitLocateNode,
  readNode: ReadNode,
  writeNode: WriteNode,
  drawNode: DrawNode,
  printNode: PrintNode,
};

export default function Page() {
  return <Flow />;
}

function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [nodeIdCounter, setNodeIdCounter] = useState(initialNodes.length + 1);
  const [helperLineHorizontal, setHelperLineHorizontal] = useState<number | undefined>(undefined);
  const [helperLineVertical, setHelperLineVertical] = useState<number | undefined>(undefined);

  const deleteOnClick = useToggle();
  const modal = useToggle();
  const { toast } = useToast();

  const showToast = useCallback(
    (description: string) => {
      toast({
        title: 'Erase mode',
        description: description,
        variant: 'success',
      });
    },
    [toast],
  );

  const addNewNode = useCallback(
    (type: any) => {
      const newNode: Node = {
        id: `${nodeIdCounter}`,
        type: type,
        data: { label: 'Node', id: nodeIdCounter },
        position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      };
      setNodes((nds) => [...nds, newNode]);
      setNodeIdCounter((prev) => prev + 1);
    },
    [nodeIdCounter],
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

    return applyNodeChanges(changes, nodes);
  }, []);

  const onNodeChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nodes) => customApplyNodeChanges(changes, nodes));
    },
    [customApplyNodeChanges],
  );

  const onEdgeChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const onEdgeConnect = useCallback((params: any) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'smart' }, eds)), []);

  const onNodesDelete = useCallback((deleted: Node[]) => {
    setNodes((nds) => nds.filter((node) => !deleted.some((d) => d.id === node.id)));
    setEdges((eds) => eds.filter((edge) => !deleted.some((d) => d.id === edge.source || d.id === edge.target)));
  }, []);

  const onEdgesDelete = useCallback((deleted: Edge[]) => {
    setEdges((eds) => eds.filter((edge) => !deleted.some((d) => d.id === edge.id)));
  }, []);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (deleteOnClick.isOpen) {
        setNodes((nds) => nds.filter((n) => n.id !== node.id));
        setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
      }
    },
    [deleteOnClick],
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      if (deleteOnClick.isOpen) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
    },
    [deleteOnClick],
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      if (!deleteOnClick.isOpen) {
        setNodes((nds) => nds.filter((n) => n.id !== node.id));
        setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
      }
    },
    [deleteOnClick],
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      if (!deleteOnClick.isOpen) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
    },
    [deleteOnClick],
  );

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);
  const memoizedEdgeTypes = useMemo(() => edgeTypes, []);

  return (
    <>
      <div className="m-3 md:m-4 top-0 left-0 absolute flex-col flex z-20">
        <button
          className={cn('p-[5px] border  h-[30px] w-[30px] border-[#eee] hover:bg-[#f4f4f4] border-b-0 transition-colors', deleteOnClick.isOpen ? 'bg-white' : 'bg-slate-200')}
          onClick={() => {
            deleteOnClick.toggle();
            showToast(deleteOnClick.isOpen ? 'Erase mode off' : 'Erase mode on');
          }}
        >
          <svg id="icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="h-[16px] w-[16px]">
            <defs>
              <style dangerouslySetInnerHTML={{ __html: '.cls-1{fill:none;}' }} />
            </defs>
            <title />
            <rect height={2} width={23} x={7} y={27} />
            <path d="M27.38,10.51,19.45,2.59a2,2,0,0,0-2.83,0l-14,14a2,2,0,0,0,0,2.83L7.13,24h9.59L27.38,13.34A2,2,0,0,0,27.38,10.51ZM15.89,22H8L4,18l6.31-6.31,7.93,7.92Zm3.76-3.76-7.92-7.93L18,4,26,11.93Z" transform="translate(0 0)" />
            <rect className="cls-1" data-name="<Transparent Rectangle>" height={32} id="_Transparent_Rectangle_" width={32} />
          </svg>
        </button>
        <button className="bg-white p-[5px] py-[7px] h-[30px] w-[30px] transition-colors hover:bg-[#f4f4f4] border-[#eee] border flex items-center justify-center" onClick={modal.open}>
          <svg version="1.1" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="h-[12px] w-[12px]">
            <title />
            <desc />
            <defs />
            <g fill="none" fillRule="evenodd" id="Page-1" stroke="none" strokeWidth="{1}">
              <g fill="#000000" id="Core" transform="translate(-213.000000, -129.000000)">
                <g id="create" transform="translate(213.000000, 129.000000)">
                  <path d="M0,14.2 L0,18 L3.8,18 L14.8,6.9 L11,3.1 L0,14.2 L0,14.2 Z M17.7,4 C18.1,3.6 18.1,3 17.7,2.6 L15.4,0.3 C15,-0.1 14.4,-0.1 14,0.3 L12.2,2.1 L16,5.9 L17.7,4 L17.7,4 Z" id="Shape" />
                </g>
              </g>
            </g>
          </svg>
        </button>
        <button className="bg-white  h-[30px] w-[30px] p-[5px] py-[5px] transition-colors hover:bg-[#f4f4f4] border-[#eee] border flex items-center justify-center">
          <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px]">
            <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 336c-18 0-32 14-32 32s13.1 32 32 32c17.1 0 32-14 32-32S273.1 336 256 336zM289.1 128h-51.1C199 128 168 159 168 198c0 13 11 24 24 24s24-11 24-24C216 186 225.1 176 237.1 176h51.1C301.1 176 312 186 312 198c0 8-4 14.1-11 18.1L244 251C236 256 232 264 232 272V288c0 13 11 24 24 24S280 301 280 288V286l45.1-28c21-13 34-36 34-60C360 159 329 128 289.1 128z" />
          </svg>
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodeChange}
        onEdgesChange={onEdgeChange}
        onConnect={onEdgeConnect}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={memoizedNodeTypes}
        edgeTypes={memoizedEdgeTypes}
        onNodeClick={(event, node) => onNodeClick(event, node)}
        onEdgeClick={onEdgeClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        proOptions={proOptions}
      >
        <MiniMap />
        <Controls />
        <Background />
        <HelperLines horizontal={helperLineHorizontal} vertical={helperLineVertical} />
      </ReactFlow>
      <Modal isOpen={modal.isOpen} onClose={modal.toggle}>
        <div className="p-2 grid grid-cols-2 gap-4 text-center text-white transition-colors">
          <div
            className="cursor-pointer hover:text-slate-500"
            onClick={() => {
              modal.close();
              addNewNode('textUpdater');
            }}
          >
            Custom
          </div>
          <div
            className="cursor-pointer hover:text-slate-500"
            onClick={() => {
              modal.close();
              addNewNode('setNode');
            }}
          >
            Set
          </div>
        </div>
      </Modal>
    </>
  );
}
