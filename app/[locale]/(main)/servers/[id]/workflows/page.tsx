'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './workflow.module.css';
import '@xyflow/react/dist/style.css';

import { WorkflowEditorProvider } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-editor';

import Tran from '@/components/common/tran';

import { Background, ReactFlowProvider } from '@xyflow/react';

export default function Page() {
	return (
		<ReactFlowProvider>
			<div className="hidden sm:flex w-full h-full">
				<DndProvider backend={HTML5Backend}>
					<WorkflowEditorProvider>
						<Background />
					</WorkflowEditorProvider>
				</DndProvider>
			</div>
			<span className="sm:hidden flex h-full w-full items-center justify-center font-bold m-auto">
				<Tran text="logic.require-bigger-device-screen" />
			</span>
		</ReactFlowProvider>
	);
}
