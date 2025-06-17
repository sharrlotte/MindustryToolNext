'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './style.css';
import '@xyflow/react/dist/style.css';

import SideBar from '@/app/[locale]/(main)/servers/[id]/workflows/sidebar';

import Tran from '@/components/common/tran';

import { Background, ReactFlowProvider } from '@xyflow/react';

export default function Page() {
	return (
		<ReactFlowProvider>
			<DndProvider backend={HTML5Backend}>
				<div className="hidden grid-cols-[auto_1fr] sm:grid w-full h-full">
					<SideBar />
					<Background />
				</div>
				<span className="sm:hidden flex h-full w-full items-center justify-center font-bold m-auto">
					<Tran text="logic.require-bigger-device-screen" />
				</span>
			</DndProvider>
		</ReactFlowProvider>
	);
}
