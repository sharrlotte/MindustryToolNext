import { unstable_cache } from 'next/cache';
import { cache } from 'react';

import { catchError, serverApi } from '@/action/common';
import axiosInstance from '@/query/config/config';
import { getSchematic } from '@/query/schematic';
import { getUser } from '@/query/user';

export const getCachedSchematic = cache((id: string) => serverApi((axios) => getSchematic(axios, { id })));

export const getCachedUser = async (id: string) =>
	unstable_cache(() => catchError(axiosInstance, (axios) => getUser(axios, { id })));
