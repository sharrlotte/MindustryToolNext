import { Metadata } from 'next';
import React from 'react';

import { LogicEditorProvider } from '@/app/[locale]/logic/logic-editor-context';

import Tran from '@/components/common/tran';

import { Locale } from '@/i18n/config';
import { getTranslation } from '@/i18n/server';
import { formatTitle, generateAlternate } from '@/lib/utils';

import { Background, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import './style.css';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const { t } = await getTranslation(locale, ['common', 'meta']);
	const title = t('logic');

	return {
		title: formatTitle(title),
		description: t('logic-description'),
		openGraph: {
			title: formatTitle(title),
			description: t('logic-description'),
		},
		alternates: generateAlternate('/logic'),
	};
}

type Props = {
	params: Promise<{ locale: Locale }>;
};
export default function Page() {
	return (
		<ReactFlowProvider>
			<Flow />
		</ReactFlowProvider>
	);
}

function Flow() {
	return (
		<>
			<div className="hidden grid-cols-[auto_1fr] h-full sm:grid">
				<ReactFlowProvider>
					<LogicEditorProvider>
						<Background />
					</LogicEditorProvider>
				</ReactFlowProvider>
			</div>
			<span className="sm:hidden flex h-full w-full items-center justify-center font-bold m-auto">
				<Tran text="logic.require-bigger-device-screen" />
			</span>
		</>
	);
}
