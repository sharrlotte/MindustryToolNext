export type ServerPlugin = {
    name: string;
    filename: string;
    meta: ModMetaDto;
}

export type ModMetaDto = {
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
}
