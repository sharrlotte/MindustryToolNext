'use client';

export enum InputType {
	TextInput, 
}

export interface FieldType {
	readonly x: number;
	readonly y: number;
	readonly fieldSize: number;
	readonly beforeText: number;
	readonly beforeTextWidth: number;
	readonly inputType: InputType;
	value: string;
}

export default interface Command {
	readonly name: string;
	readonly color: string;
	readonly rowCount: number;
	readonly columnCount: number;
	readonly isStartCommand: boolean;
	readonly fields: FieldType[];
	readonly outputs: number[];
	pos: { posx: number, posy: number }
}