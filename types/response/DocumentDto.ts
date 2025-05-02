import { Locale } from "@/i18n/config";

export type DocumentDto = {
	id: string;
	path: string;
	userId: string;
	itemId: string;
	treeId: string;
	title: string;
	language: Locale;
	updatedAt: string;
	createdAt: string;
};
