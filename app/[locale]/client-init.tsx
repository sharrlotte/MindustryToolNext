'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useInterval } from 'usehooks-ts';

import useClientApi from '@/hooks/use-client';
import { Batcher } from '@/lib/batcher';

import { useQuery } from '@tanstack/react-query';

const ignored = ['login'];

export default function ClientInit() {
	const axios = useClientApi();
	const [_ignore, setCookie] = useCookies();
	const pathname = usePathname();

	useQuery({
		queryKey: ['ping'],
		queryFn: () => axios.get('/ping?client=web').then((res) => res.data),
	});

	useInterval(async () => {
		await Batcher.process();
	}, 50);

	useLayoutEffect(() => {
		if (!ignored.some((ig) => pathname.includes(ig))) {
			setCookie('redirect_uri', window.location.href, {
				path: '/',
			});
		}
	}, [setCookie, pathname]);

	return undefined;
}
