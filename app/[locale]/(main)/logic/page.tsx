'use client';

import { motion } from 'framer-motion';
import { Eraser, HelpCircle, Pencil, Redo2, Undo2 } from 'lucide-react';
import { ReactNode, useMemo, useState } from 'react';
import React from 'react';

import { LogicEditorProvider, nodeOptions, useLogicEditor } from '@/app/[locale]/(main)/logic/logic-editor-context';
import { Output } from '@/app/[locale]/(main)/logic/node';

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/common/icons';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Background, Controls, MiniMap, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import './style.css';
import { InstructionNode } from '@/app/[locale]/(main)/logic/instruction.node';

export default function Page() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

function Flow() {
  return (
    <ReactFlowProvider>
      <LogicEditorProvider>
        <LiveCodePanel />
        <TopLeftMenu />
        <MiniMap />
        <Controls />
        <Background />
      </LogicEditorProvider>
    </ReactFlowProvider>
  );
}

function LiveCodePanel() {
  const { nodes, edges } = useLogicEditor();
  const [show, setShow] = useState(false);

  const code = useMemo(() => {
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
      const edgeId = edge.map(e => e.target)

      if (!edge) return {};

      const nextNode = nodes.filter((node) => node.type === 'instruction' && edgeId.includes(node.id));

      function getEdgeIndex(target: InstructionNode) {
        const result = edge.find((e) => e.target === target.id);

        if (!result) throw new Error('Edge not found');

        if (node.data.node === undefined) {
          throw new Error('Node not found');
        }

        const index = node.data.node.outputs.findIndex(o => o.label === result.label);

        if (index === -1) {
          return undefined;
        }

        const output = node.data.node.outputs[index];

        return { index, output, target };
      }

      const sorted = nextNode.reduce<{
        index: number;
        output: Output;
        target: InstructionNode;
      }[]>((prev, curr) => {
        const r = getEdgeIndex(curr)

        if (r) {
          prev.push(r);
        }

        return prev;
      }, []).sort((a, b) => (b.index) - (a.index))

      const initial: Record<string, InstructionNode> = {}

      return sorted.reduce<Record<string, InstructionNode>>((prev, curr) => {
        prev[curr.output.label] = curr.target;

        return prev;
      }, initial);
    }

    while (nextNode) {
      nextNode = queue.pop()

      if (!nextNode) break;

      if (visited.includes(nextNode.id)) {
        continue;
      }
      visited.push(nextNode.id);
      lines.push(`${index} ${(nextNode.data.node as any).compile({ state: nextNode.data.state, next: findNextNodes(nextNode) })}`);
      nextNode.data.index = index;
      queue.push(...Object.values(findNextNodes(nextNode)));
      index++;
    }

    return lines;
  }, [edges, nodes]);

  return (
    <div className="top-0 right-0 absolute z-10 flex items-start gap-2 m-4">
      <button className="bg-white p-2 rounded-md text-black" onClick={() => setShow((prev) => !prev)}>
        {show ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </button>
      <motion.div
        animate={show ? 'open' : 'close'}
        variants={{
          open: {
            width: 'min(100vw,600px)',
          },
          close: {
            width: 0,
          },
        }}
        className="p-2 text-lg rounded-md flex-col flex text-black bg-white h-[calc(100dvh-400px)]"
      >
        {show && (
          <div>
            {code.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
function TopLeftMenu() {
  const {
    actions: { redo, undo, toggleDeleteOnClick },
  } = useLogicEditor();

  return (
    <div className="top-0 left-0 absolute flex-col flex z-10 text-black m-4">
      <MlogEditorButton onClick={toggleDeleteOnClick}>
        <Eraser className="h-4 w-4" strokeWidth={1.5} />
      </MlogEditorButton>
      <AddNodeDialog />
      <MlogEditorButton>
        <HelpCircle className="h-4 w-4" strokeWidth={1.5} />
      </MlogEditorButton>
      <MlogEditorButton onClick={undo}>
        <Undo2 className="h-4 w-4" strokeWidth={1.5} />
      </MlogEditorButton>
      <MlogEditorButton onClick={redo}>
        <Redo2 className="h-4 w-4" strokeWidth={1.5} />
      </MlogEditorButton>
    </div>
  );
}

function AddNodeDialog() {
  const {
    actions: { addNode },
  } = useLogicEditor();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MlogEditorButton>
          <Pencil className="h-4 w-4" strokeWidth={1.5} />
        </MlogEditorButton>
      </DialogTrigger>
      <DialogContent className="p-6 rounded-lg">
        <DialogTitle />
        <DialogDescription />
        {nodeOptions.map((option, index) => (
          <div className="flex flex-col border-b py-2 gap-2" key={index}>
            <p className="text-lg">{option.label}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {option.items.map((item: { type: string; label: string }) => (
                <DialogClose key={item.type} className="cursor-pointer hover:text-slate-500 transition-colors" onClick={() => addNode(item.type)}>
                  {item.label}
                </DialogClose>
              ))}
            </div>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
}

type MlogEditorButtonProps = {
  onClick?: () => void;
  children: ReactNode;
};

function MlogEditorButton({ onClick, children }: MlogEditorButtonProps) {
  return (
    <button className="bg-white p-[5px] py-[7px] h-[28px] w-[28px] transition-colors hover:bg-[#f4f4f4] border-[#eee] border flex items-center justify-center" onClick={onClick}>
      {children}
    </button>
  );
}
