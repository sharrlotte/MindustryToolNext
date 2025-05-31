export type ServerManagerPlugin = {
	name: string;
	filename: string;
	servers: string[];
	meta: {
		name: string;
		internalName: string;
		minGameVersion: string;
		displayName: string;
		author: string;
		description: string;
		subtitle: string;
		version: string;
		main: string;
		repo: string;
		dependencies: string[];
		hidden: boolean;
		java: boolean;
	};
};
