export interface ServerCommandDto {
    text: string;
    paramText: string;
    description: string;
    params: CommandParamDto[];
}

export interface CommandParamDto {
    name: string;
    optional: boolean;
    variadic: boolean;
}
