import { InstructionNode } from "@/app/[locale]/logic/instruction.node";



import { PresetType } from '@/constant/constant';
import { TagGroup } from '@/types/response/TagGroup';

import { Edge, ReactFlowJsonObject } from '@xyflow/react';


export type TagPreset = {
	name: string;
	type: PresetType;
	tags: TagGroup[];
};

export type LogicSaveData = ReactFlowJsonObject<InstructionNode, Edge>

export type LogicSave = {
	files: {
		name: string;
		data: LogicSaveData;
	}[];
	currentFile?: string;
};
