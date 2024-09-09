export enum InputType {
  TextInput,
}

export default interface Command {
  x: number;
  y: number;
  value: CommandValue;
  // How to encode? idk
}

export interface CommandValue {
  readonly name: string;
  readonly color: string;
  readonly rows: number;
  readonly columns: number;
  readonly fields: FieldType[];
  readonly outputs: { key: number; value: number }[];
}

export interface FieldType {
  readonly x: number;
  readonly y: number;
  readonly fieldSize: number;
  readonly placeHolder: string;
  readonly placeHolderWidth: number; // px, not %!
  readonly inputType: InputType;
  readonly linkedOutput?: number;
  value: string | CommandValue;
  displayValue?: string;
}

const defaultField: FieldType = {
  x: 0,
  y: 0,
  fieldSize: 1,
  placeHolder: '',
  placeHolderWidth: 100,
  inputType: InputType.TextInput,
  value: 'test',
};

const defaultSettings: Command = {
  x: 0,
  y: 0,
  value: {
    name: '',
    color: 'white',
    rows: 0,
    columns: 0,
    fields: [],
    outputs: [],
  },
};

export const start: Command = {
  ...defaultSettings,
  value: {
    ...defaultSettings.value,
    name: 'Start',
    color: '#0AA4FE',
  },
};

const read: Command = {
  ...defaultSettings,
  value: {
    name: 'Read',
    color: '#9E7FB3',
    rows: 2,
    columns: 2,
    fields: [
      {
        ...defaultField,
        placeHolder: 'read',
        placeHolderWidth: 40,
      },
    ],
    outputs: [],
  },
};

export const CommandList: { key: string; value: Command[] }[] = [
  { key: 'Start commands', value: [start] },
  { key: 'IO control', value: [read] },
];
