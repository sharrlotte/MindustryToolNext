export type WorkflowNode = {
	id: number;
	x: number;
	y: number;
	name: string;
	group: string;
	color: string;
	consumers: {
		name: string;
		type: string;
		value: string;
	}[];
	producers: {
		name: string;
		type: any;
	}[];
	outputs: {
		name: string;
		description: string;
		nextId: number;
	}[];
	parameters: {
		name: string;
		type: string;
		required: boolean;
		options: {
			label: string;
			value: string;
		}[];
		value: any;
	}[];
};
