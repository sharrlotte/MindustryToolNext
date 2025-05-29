'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import Tran from '@/components/common/tran';
import BackButton from '@/components/ui/back-button';

const StarScene = dynamic(() => import('./star-scene'));

export default function NotFoundScreen() {
	return (
		<StarScene>
			<div className="flex text-white pointer-events-none h-full flex-1 flex-col items-center justify-center gap-4 z-50 absolute inset-0">
				<div className="pointer-events-auto">
					<h2 className="text-bold text-3xl">
						<Tran text="not-found" />
					</h2>
					<p>
						<Tran text="not-found-description" />
					</p>
					<div className="grid grid-cols-2 gap-2">
						<Link className="rounded-md text-center bg-brand p-2 text-sm text-brand-foreground" href="/">
							<Tran text="home" />
						</Link>
						<BackButton variant="primary" />
					</div>
				</div>
			</div>
		</StarScene>
	);
}
