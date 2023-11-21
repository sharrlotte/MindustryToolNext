'use client';

import React from 'react';
import HydratedSchematic from './hydrated-schematics';

export default function Page() {
	return (
		<HydratedSchematic
			searchParams={{
				page: 0,
				name: '',
				authorId: '',
				tags: [],
				sort: 'time_1',
			}}
		/>
	);
}
