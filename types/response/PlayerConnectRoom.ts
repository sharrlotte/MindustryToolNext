export type PlayerConnectRoom = {
    link: string,
    address: string,
    roomId: string,
    data: {
        name: string,
        status: string,
        isPrivate: string,
        isSecured: string,
        players: Array<{
            name: string,
            locale: string
        }>,
        mapName: string,
        gamemode: string,
        mods: string[],
        version: string,
        locale: string,
        createdAt: number
    }
}
