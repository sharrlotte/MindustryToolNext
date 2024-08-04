'use client';

import { useEffect, useState } from 'react';
import { PaginationSearchQuery } from '@/types/data/pageable-search-schema';
import SchematicPreviewCard from '@/components/schematic/schematic-preview-card';
import MapPreviewCard from '@/components/map/map-preview-card';
import getSchematics from '@/query/schematic/get-schematics';
import getMaps from '@/query/map/get-maps';
import axiosInstance from '@/query/config/config';
import { Schematic } from '@/types/response/Schematic';

export function SchematicRowView({ queryParam }: { queryParam: PaginationSearchQuery }) {
	const [elementArray, setElementArray] = useState<Schematic[]>([]);

	useEffect(() => {
		getSchematics(axiosInstance, queryParam).then(data => {
			setElementArray(data);
		});
	}, [queryParam]);

	return (
		<ul className="flex overflow-x-auto list-none p-0 m-0">
			{elementArray.map(schematic => (
				<li key={schematic.id} className="flex-shrink-0 border rounded">
					<SchematicPreviewCard schematic={schematic} />
				</li>
			))}
		</ul>
	);
}

export function MapRowView({ queryParam }: { queryParam: PaginationSearchQuery }) {
	const [elementArray, setElementArray] = useState<Schematic[]>([]);

	useEffect(() => {
		getMaps(axiosInstance, queryParam).then(data => {
			setElementArray(data);
		});
	}, [queryParam]);

	return (
		<ul className="flex overflow-x-auto list-none p-0 m-0">
			{elementArray.map(schematic => (
				<li key={schematic.id} className="flex-shrink-0 border rounded">
					<MapPreviewCard map={schematic} />
				</li>
			))}
		</ul>
	);
}
