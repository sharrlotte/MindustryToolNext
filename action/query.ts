import { cache } from 'react';

import 'server-only';

import axiosInstance from '@/query/config/config';
import { getMap, getMapUpload } from '@/query/map';
import { getSchematic, getSchematicUpload } from '@/query/schematic';
import { getUser } from '@/query/user';

import { catchError, serverApi } from '@/action/common';

import { unstable_cache } from 'next/cache';

export const getCachedUser = unstable_cache(
	(id: string) => catchError(axiosInstance, (axios) => getUser(axios, { id })),
	['user'],
	{
		revalidate: 60 * 60 * 24,
	},
);

export const getCachedSchematic = cache((id: string) => serverApi((axios) => getSchematic(axios, { id })));

export const getCachedMap = cache((id: string) => serverApi((axios) => getMap(axios, { id })));

export const getCachedSchematicUpload = cache((id: string) => serverApi((axios) => getSchematicUpload(axios, { id })));

export const getCachedMapUpload = cache((id: string) => serverApi((axios) => getMapUpload(axios, { id })));
