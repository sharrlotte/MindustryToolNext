'use client';

import { Eraser, MapIcon, PlusCircleIcon, RedoIcon, UndoIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { ReactNode } from 'react';

import { nodeOptions, useLogicEditor } from '@/app/[locale]/logic/logic-editor-context';

import { CatchError } from '@/components/common/catch-error';
import { Hidden } from '@/components/common/hidden';
import { LivePanelIcon } from '@/components/common/icons';
import Shortcut from '@/components/common/shortcut';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/sonner';

import useShortcut from '@/hooks/use-shortcut';

import { PopoverClose } from '@radix-ui/react-popover';
import { useReactFlow } from '@xyflow/react';

type TabType = {
	label: string;
	items: ReactNode[];
};

const tabs: TabType[] = [
	{
		label: 'logic.edit',
		items: [<EraseButton key={0} />, <AddNodeButton key={1} />, <RedoButton key={2} />, <UndoButton key={3} />],
	},
	{
		label: 'logic.view',
		items: [<ZoomIn key={0} />, <ZoomInOut key={1} />, <MiniMapButton key={2} />, <LiveCodeButton key={3} />],
	},
	{
		label: 'logic.help',
		items: [],
	},
];

export default function ToolBar() {
	return (
		<div className="min-h-nav bg-card border-b overflow-x-auto p-1 flex items-center w-full">
			<CatchError>
				<ShortcutHandler />
				{tabs.map((tab, index) => (
					<Popover key={index}>
						<PopoverTrigger className="hover:bg-secondary text-muted-foreground hover:text-foreground p-2 py-1 rounded-sm capitalize">
							<Tran asChild text={tab.label} />
						</PopoverTrigger>
						<PopoverContent className="p-1 mx-2 my-4 bg-card grid capitalize space-y-1">
							{tab.items.map((item, index) => (
								<PopoverClose key={index} asChild>
									{item}
								</PopoverClose>
							))}
						</PopoverContent>
					</Popover>
				))}
				<AddNodeDialog />
			</CatchError>
		</div>
	);
}

function AddNodeDialog() {
	const {
		showAddNodeDialog,
		actions: { addNode, setShowAddNodeDialog },
	} = useLogicEditor();

	return (
		<Dialog open={showAddNodeDialog} onOpenChange={setShowAddNodeDialog}>
			<DialogContent className="p-6 rounded-lg">
				<Hidden>
					<DialogTitle />
					<DialogDescription />
				</Hidden>
				{nodeOptions.map((option, index) => (
					<div className="flex flex-col border-b py-2 gap-2" key={index}>
						<p className="text-lg">{option.key}</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
							{option.value.map(([key, item]: any) =>
								'category' in item && 'children' in item ? (
									<Popover key={key}>
										<PopoverTrigger>{item.label}</PopoverTrigger>
										<PopoverContent className="grid grid-cols-2 gap-2">
											{Object.entries(item.children).map(([key, value]: [any, any]) => (
												<DialogClose key={key} className="cursor-pointer hover:text-slate-500 transition-colors" onClick={() => addNode(key)}>
													{value.label}
												</DialogClose>
											))}
										</PopoverContent>
									</Popover>
								) : (
									<DialogClose key={key as any} className="cursor-pointer hover:text-slate-500 transition-colors" onClick={() => addNode(key as unknown as any)}>
										{item.label}
									</DialogClose>
								),
							)}
						</div>
					</div>
				))}
			</DialogContent>
		</Dialog>
	);
}

function ZoomIn() {
	const { zoomIn } = useReactFlow();

	return (
		<Button onClick={() => zoomIn({ duration: 300 })} variant={'toogle'}>
			<ZoomInIcon className="size-4" />
			<Tran asChild text="logic.zoom-in" />
		</Button>
	);
}
function ZoomInOut() {
	const { zoomOut } = useReactFlow();

	return (
		<Button onClick={() => zoomOut({ duration: 300 })} variant={'toogle'}>
			<ZoomOutIcon className="size-4" />
			<Tran asChild text="logic.zoom-out" />
		</Button>
	);
}

function MiniMapButton() {
	const {
		showMiniMap,
		actions: { setShowMiniMap },
	} = useLogicEditor();

	return (
		<Button onClick={() => setShowMiniMap(!showMiniMap)} variant={showMiniMap ? 'toogled' : 'toogle'}>
			<MapIcon className="size-4" />
			<Tran asChild text="logic.show-minimap" />
			<Shortcut shortcut={['ctrl', 'm']} />
		</Button>
	);
}

function LiveCodeButton() {
	const {
		showLiveCode,
		actions: { setShowLiveCode },
	} = useLogicEditor();

	return (
		<Button onClick={() => setShowLiveCode(!showLiveCode)} variant={showLiveCode ? 'toogled' : 'toogle'}>
			<LivePanelIcon className="size-4" />
			<Tran asChild text="logic.show-live-code" />
			<Shortcut shortcut={['ctrl', 'l']} />
		</Button>
	);
}

function EraseButton() {
	const {
		isDeleteOnClick,
		actions: { toggleDeleteOnClick },
	} = useLogicEditor();

	return (
		<Button onClick={toggleDeleteOnClick} variant={isDeleteOnClick ? 'toogled' : 'toogle'}>
			<Eraser className="size-4" />
			<Tran asChild text="logic.erase" />
			<Shortcut shortcut={['ctrl', 'e']} />
		</Button>
	);
}

function AddNodeButton() {
	const {
		actions: { setShowAddNodeDialog },
	} = useLogicEditor();

	return (
		<Button variant="toogle" onClick={() => setShowAddNodeDialog(true)}>
			<PlusCircleIcon className="h-4 w-4" />
			<Tran text="logic.add-node" />
			<Shortcut shortcut={['alt', 'n']} />
		</Button>
	);
}

function RedoButton() {
	const {
		canRedo,
		actions: { redo },
	} = useLogicEditor();

	return (
		<Button disabled={!canRedo} onClick={redo} variant="toogle">
			<RedoIcon className="size-4" />
			<Tran asChild text="logic.redo" />
			<Shortcut shortcut={['ctrl', 'y']} />
		</Button>
	);
}
function UndoButton() {
	const {
		canUndo,
		actions: { undo },
	} = useLogicEditor();

	return (
		<Button disabled={!canUndo} onClick={undo} variant="toogle">
			<UndoIcon className="size-4" />
			<Tran asChild text="logic.undo" />
			<Shortcut shortcut={['ctrl', 'z']} />
		</Button>
	);
}

function ShortcutHandler() {
	const {
		isDeleteOnClick,
		showLiveCode,
		showMiniMap,
		actions: { undo, redo, toggleDeleteOnClick, setShowAddNodeDialog, setShowMiniMap, setShowLiveCode },
	} = useLogicEditor();

	useShortcut(['ctrl', 'e'], () => {
		if (isDeleteOnClick) {
			toast('Delete on click disabled');
		} else {
			toast('Delete on click enabled');
		}
		toggleDeleteOnClick();
	});

	useShortcut(['ctrl', 'z'], () => {
		undo();
	});

	useShortcut(['ctrl', 'y'], () => {
		redo();
	});

	useShortcut(['alt', 'n'], () => {
		setShowAddNodeDialog(true);
	});

	useShortcut(['ctrl', 's'], () => {
		toast(<Tran text="saved" />);
	});

	useShortcut(['ctrl', 'l'], () => {
		setShowLiveCode(!showLiveCode);
	});

	useShortcut(['ctrl', 'm'], () => {
		setShowMiniMap(!showMiniMap);
	});

	return <></>;
}
