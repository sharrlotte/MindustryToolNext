'use client';

import { motion } from 'framer-motion';
import { Eraser, HelpCircle, Pencil, Redo2, Undo2 } from 'lucide-react';
import { ReactNode, useMemo, useState } from 'react';
import React from 'react';

import { LogicEditorProvider, useLogicEditor } from '@/app/[locale]/(main)/logic/logic-editor-context';
import { nodeOptions } from '@/app/[locale]/(main)/logic/node';

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/common/icons';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Background, Controls, MiniMap, Node, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import './style.css';

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

    let nextNode = nodes.find((node) => node.type === 'instruction' && node.id === startEdge.target);

    if (!nextNode) {
      return lines;
    }

    function findNextNode(node: Node) {
      const edge = edges.find((edge) => edge.source === node.id);
      if (!edge) return undefined;
      const nextNode = nodes.find((node) => node.type === 'instruction' && node.id === edge.target);
      return nextNode;
    }

    while (nextNode) {
      if (visited.includes(nextNode.id)) {
        lines.push(`${index} ${(nextNode.data.node as any).compile(nextNode.data.state)}`);
        nextNode.data.index = index;
        break;
      }
      visited.push(nextNode.id);
      lines.push(`${index} ${(nextNode.data.node as any).compile(nextNode.data.state)}`);
      nextNode.data.index = index;
      nextNode = findNextNode(nextNode);
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
                <DialogClose key={item.type} className="cursor-pointer hover:text-slate-500 transition-colors" onClick={() => addNode(item.type, item.label)}>
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
