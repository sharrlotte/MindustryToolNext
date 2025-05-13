import React from 'react';

import Tran from '@/components/common/tran';

export default function Page() {
	return (
		<div className="flex h-full flex-col items-center justify-center text-3xl font-bold">
			<Tran className="text-success-foreground" text="token.verified" />
			<Tran text="token.you-can-go-back-to-game-now" />
		</div>
	);
}
