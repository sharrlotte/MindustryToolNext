'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './workflow.module.css';
import '@xyflow/react/dist/style.css';

import HostServerButton from '@/app/[locale]/(main)/servers/[id]/(dashboard)/host-server-button';
import { WorkflowEditorProvider } from '@/app/[locale]/(main)/servers/[id]/workflows/workflow-editor';

import Tran from '@/components/common/tran';

import usePathId from '@/hooks/use-path-id';
import useServerStatus from '@/hooks/use-server-status';

import { Background, ReactFlowProvider } from '@xyflow/react';

export default function Page() {
	const id = usePathId();
	const status = useServerStatus(id);

	if (status === 'UNAVAILABLE') {
		return (
			<div className="flex h-full w-full justify-center items-center">
				<span>Host server to use</span>
				<HostServerButton id={id} />
			</div>
		);
	}

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
