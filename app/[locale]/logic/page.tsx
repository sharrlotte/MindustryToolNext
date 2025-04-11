'use client';

import React from 'react';

import LiveCodePanel from '@/app/[locale]/logic/live-code-panel';
import { LogicEditorProvider } from '@/app/[locale]/logic/logic-editor-context';

import { Background, Controls, MiniMap, ReactFlowProvider } from '@xyflow/react';
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
		<div className="flex flex-col h-full overflow-hidden">
			<ReactFlowProvider>
				<LogicEditorProvider>
					<LiveCodePanel />
					<MiniMap />
					<Background />
				</LogicEditorProvider>
			</ReactFlowProvider>
		</div>
	);
}
