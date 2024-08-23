'use client';
import React from "react";

export interface inputTypeParam {
    px: number; py: number; // middle
}

export interface inputType {
    show: (prop: inputTypeParam) => React.JSX.Element;
    value: string;
}

export interface fieldType {
    readonly x: number;
    readonly y: number;
    readonly expand: number;
    readonly beforeText: string;
    readonly bfTextWidth: number;
    readonly inputType: inputType;
}

export interface Command {
    readonly name: string;
    readonly color: string;
    readonly gridSize: number;
    readonly columnCount: number;
    readonly isStart: boolean;
    values: fieldType[];
    outputs: number[];
    lastx: number;
    lasty: number;
    posx: number;
    posy: number;
}

// field type
export const textInput: fieldType = {
    x: 0,
    y: 0,
    expand: 1,
    beforeText: "input",
    bfTextWidth: 10,
    inputType: {
        show: function (props: inputTypeParam): React.JSX.Element {
            return <div id={props.px+''}></div>
        },
        value: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    }
}

// commands
export const defaultCommand: Command = {
    name: "",
    color: "white",
    gridSize: 0,
    columnCount: 0,
    values: [],
    isStart: false,
    lastx: 0,
    lasty: 0,
    posx: 0,
    posy: 0,
    outputs: [],
};

// start operation
export const start: Command = {
    ...defaultCommand,
    name: "Start Command",
    color: "#5ABFFA",
    isStart: true,
}

// io control
export const read: Command = {
    ...defaultCommand,
    name: "Read Cell",
    color: "#8782FE",
    gridSize: 2,
    columnCount: 2,
    values: [
        {...textInput, bfTextWidth: 40},
        {...textInput, x: 1, y: 1, bfTextWidth: 40}
    ],
};
