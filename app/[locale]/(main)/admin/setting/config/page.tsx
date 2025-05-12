'use client';

import { AxiosInstance } from 'axios';
import React, { useState } from 'react';

import Tran from '@/components/common/tran';
import { Input } from '@/components/ui/input';

import useClientApi from '@/hooks/use-client';

import { useMutation } from '@tanstack/react-query';

async function toggleDebug(axios: AxiosInstance, value: boolean): Promise<{ data: boolean }> {
	return await axios.post(`/debug`, null, {
		params: {
			value,
		},
	});
}

export default function Page() {
	return (
		<div className="flex h-full gap-1 bg-card p-2">
			<DebugOption />
		</div>
	);
}
function DebugOption() {
	const [value, setValue] = useState<boolean>(false);
	const axios = useClientApi();

	const { mutate, isPending } = useMutation({
		mutationKey: ['debug'],
		mutationFn: async (value: boolean) => toggleDebug(axios, value),
		onSuccess: (data) => setValue(data.data),
	});

	function handleChange(data: boolean) {
		mutate(data);
		setValue(data);
	}

	return (
		<div className="flex gap-1 items-center">
			<Input
				className="aspect-square w-4"
				type="checkbox"
				checked={value}
				disabled={isPending}
				onChange={(e) => handleChange(e.target.checked)}
			/>
			<Tran text="setting.debug" />
		</div>
	);
}
