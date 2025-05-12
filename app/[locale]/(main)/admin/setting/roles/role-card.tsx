import type { Identifier, XYCoord } from 'dnd-core';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { EllipsisButton } from '@/components/ui/ellipsis-button';

import { cn } from '@/lib/utils';
import { Role, RoleWithAuthorities } from '@/types/response/Role';
import Tran from '@/components/common/tran';

type RoleCardProps = {
	role: RoleWithAuthorities;
	index: number;
	bestRole?: Role;
	onDrop: () => void;
	onHover: (dragIndex: number, hoverIndex: number) => void;
};

const ChangeRoleAuthorityDialog = dynamic(() => import('@/app/[locale]/(main)/admin/setting/roles/change-role-authority.dialog'));
const DeleteRoleButton = dynamic(() => import('@/app/[locale]/(main)/admin/setting/roles/delete-role.button'));
const UpdateRoleDialog = dynamic(() => import('@/app/[locale]/(main)/admin/setting/roles/update-role.dialog'));

interface DragItem {
	index: number;
	type: string;
}

export default function RoleCard({ index, role, bestRole, onDrop, onHover }: RoleCardProps) {
	const { id, name, color, position } = role;

	const ref = useRef<HTMLDivElement>(null);
	const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
		accept: 'role',
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId(),
			};
		},
		drop() {
			if (!ref.current) {
				return;
			}
			onDrop();
		},
		hover(item: DragItem, monitor) {
			if (!ref.current) {
				return;
			}
			const dragIndex = item.index;
			const hoverIndex = index;

			if (dragIndex === hoverIndex) {
				return;
			}

			const hoverBoundingRect = ref.current?.getBoundingClientRect();

			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

			const clientOffset = monitor.getClientOffset();

			const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}

			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}

			onHover(dragIndex, hoverIndex);

			item.index = hoverIndex;
		},
	});

	const [{ isDragging }, drag] = useDrag({
		type: 'role',
		item: () => {
			return { id, index };
		},
		collect: (monitor: any) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	drag(drop(ref));

	return (
		<div
			className={cn('grid bg-card border rounded-md p-2 grid-cols-[50px_140px_auto_40px] gap-2 items-center h-12', {
				'opacity-50': isDragging,
			})}
			ref={ref}
			data-handler-id={handlerId}
		>
			<div>{position}</div>
			<Tran
				className="text-ellipsis overflow-hidden w-full h-full text-nowrap flex items-center"
				style={{ color }}
				text={name.toLowerCase()}
			/>
			<div className="overflow-hidden text-ellipsis w-full h-full">
				<ChangeRoleAuthorityDialog role={role} />
			</div>
			<div className="flex items-center justify-center">
				{bestRole && (bestRole.position > position || bestRole.name.toUpperCase() === 'SHAR') && (
					<EllipsisButton variant="ghost">
						<UpdateRoleDialog role={role} />
						<DeleteRoleButton role={role} />
					</EllipsisButton>
				)}
			</div>
		</div>
	);
}
