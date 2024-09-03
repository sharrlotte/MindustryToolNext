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
    readonly linkedOutput? : number;
    displayValue?: string | CommandValue;
}

export default interface Command {
    x: number;
    y: number;
    dragX: number;
    dragY: number;
    drag: boolean;
    value: CommandValue
    // How to encode? idk 
}

export interface CommandValue {
    readonly name: string;
    readonly color: string;
    readonly rows: number;
    readonly columns: number;
    readonly fields: {key: number, value: FieldType}[];
    readonly outputs: {key: number, value: number }[];
}

const defaultField: FieldType = {
    x: 0,
    y: 0,
    fieldSize: 0,
    placeHolder: 0,
    placeHolderWidth: 100,
    inputType: InputType.TextInput,
    value: ''
};

const defaultSettings: Command = {
    x: 0,
    y: 0,
    dragX: 0,
    dragY: 0,
    drag: false,
    value: {
        name: '',
        color: 'white',
        rows: 0,
        columns: 0,
        fields: [],
        outputs: []
    }
};


export const start: Command = {
    ...defaultSettings,
    value: {
        ...defaultSettings.value,
        name: 'Start Command',
        color: '#0AA4FE',
    }
};

export const CommandList: [{ key: string, value: Command[] }] = [
    { key: 'Start commands', value: [start] },
];