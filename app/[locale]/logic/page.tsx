'use client';

import React from 'react';

import { LogicEditorProvider } from '@/app/[locale]/logic/logic-editor-context';

import { Background, ReactFlowProvider } from '@xyflow/react';
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
					<Background />
				</LogicEditorProvider>
			</ReactFlowProvider>
		</div>
	);
}
