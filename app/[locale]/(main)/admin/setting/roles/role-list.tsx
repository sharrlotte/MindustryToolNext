'use client';

import { Suspense } from 'react';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Tran from '@/components/common/tran';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { getRoles, moveRole } from '@/query/role';
import { Role, RoleWithAuthorities } from '@/types/response/Role';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import RoleCard from '@/app/[locale]/(main)/admin/setting/roles/role-card';

type Props = {
	roles: RoleWithAuthorities[];
	bestRole: Role;
};

export default function RoleList({ roles, bestRole }: Props) {
	const axios = useClientApi();
	const { invalidateByKey } = useQueriesData();
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationKey: ['roles'],
		mutationFn: () => {
			const payload = data.map((role, index) => ({ id: role.id, index: roles.length - index }));

			return moveRole(axios, payload);
		},
		onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error?.message }),
		onSettled: () => {
			invalidateByKey(['roles']);
		},
	});

	const { data } = useQuery({
		queryKey: ['roles'],
		queryFn: () => getRoles(axios),
		initialData: roles,
	});

	function onDrop() {
		mutate();
	}

	function onHover(dragIndex: number, hoverIndex: number) {
		if (dragIndex >= bestRole.position || hoverIndex >= bestRole.position) {
			return;
		}

		queryClient.setQueryData<RoleWithAuthorities[]>(['roles'], () => {
			const updated = [...data];

			const [draggedItem] = updated.splice(dragIndex, 1);

			updated.splice(hoverIndex, 0, draggedItem);

			return updated;
		});
	}

	return (
		<Suspense>
			<DndProvider backend={HTML5Backend}>
				<div className="flex flex-col gap-2">
					{data.map((role, index) => (
						<RoleCard key={role.id} index={index} role={role} bestRole={bestRole} onDrop={onDrop} onHover={onHover} />
					))}
				</div>
			</DndProvider>
		</Suspense>
	);
}
