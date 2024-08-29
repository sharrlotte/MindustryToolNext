export enum InputType {
	TextInput, 
}

export interface FieldType {
	readonly x: number;
	readonly y: number;
	readonly fieldSize: number;
	readonly placeHolder: number;
	readonly placeHolderWidth: number; // px, not %!
	readonly inputType: InputType;
	value: string;
}

export default interface Command {
    x: number;
    y: number;
	readonly name: string;
	readonly color: string;
	readonly rows: number;
	readonly columns: number;
	readonly fields: {[key: number]: FieldType};
	readonly outputs: {[key: number]: number};
    // How to encode? idk 
}