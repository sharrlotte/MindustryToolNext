'use client';

export interface inputTypeParam {
    px: number; py: number; contextSize: number;
}

export interface inputType {
    show: (prop: inputTypeParam) => React.JSX.Element;
    value: string;
}

export interface fieldType {
    x: number;
    y: number;
    expand: number;
    afterText: string | null;
    inputType: inputType;
}

export interface Command {
    name: string;
    color: string;
    gridSize: number;
    columnCount: number;
    value: fieldType[];
    isStart: false;
    displayFirst: false;
    lastx: number;
    lasty: number;
    posx: number;
    posy: number;
    output1: number;
    output2: number;
}

// field type
export const textInput: fieldType = {
    x: 0,
    y: 0,
    expand: 0,
    afterText: null,
    inputType: {
        show: function (props: {}): React.JSX.Element {
            return <div></div>
        },
        value: ''
    }
}

// commands
export const defaultCommand: Command = {
    name: "",
    color: "#5ABFFA",
    gridSize: 0,
    columnCount: 0,
    value: [],
    isStart: false,
    displayFirst: false,
    lastx: 0,
    lasty: 0,
    posx: 0,
    posy: 0,
    output1: -1,
    output2: -1,
};

// start operator
export const start: Command = {
    ...defaultCommand,
    name: "Start",
    color: "#5ABFFA",
    gridSize: 0,
    value: []
}

// io control
export const read: Command = {
    ...defaultCommand,
    name: "Read",
    color: "#8782FE",
    gridSize: 2,
    value: [],
};
