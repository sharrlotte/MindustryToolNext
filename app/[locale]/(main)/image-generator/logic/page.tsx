'use client';

import { useState } from 'react';

import { IMAGE_PREFIX } from '@/constant/constant';
import useQueriesData from '@/hooks/use-queries-data';

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/query/config/config';

/* eslint-disable @next/next/no-img-element */

export default function Page() {
	const [file, setFile] = useState<File | null>(null);

	const { invalidateByKey } = useQueriesData();

	const { data: preview, isFetching } = useQuery({
		queryKey: ['image-preview'],
		queryFn: async () => {
			if (!file) return null;

			const form = new FormData();
			form.append('data', await file.bytes().then((v) => new Buffer(v).toString('base64')));

			const response = await axiosInstance.post('http://localhost:8081/api/v1/maps', form, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			return response.data;
		},
		enabled: !!file,
	});

	return (
		<div>
			<button onClick={() => invalidateByKey(['image-preview'])}>Refersh</button>
			<input type="file" onChange={(event) => setFile(event.currentTarget.files![0])} />
			{isFetching && <div>Loading...</div>}
			{preview && <img src={IMAGE_PREFIX + preview?.image} alt="map" />}
		</div>
	);
}
