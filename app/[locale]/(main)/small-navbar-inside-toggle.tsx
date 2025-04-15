'use client';

import React, { useCallback } from 'react';

import { useNavBar } from '@/context/navbar.context';

export default function SmallNavbarInsideToggle() {
	const { setVisible } = useNavBar();
	const hideSidebar = useCallback(() => setVisible(false), [setVisible]);

	return (
		<button className="text-2xl" onClick={hideSidebar}>
			&times;
		</button>
	);
}
