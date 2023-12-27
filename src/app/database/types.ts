export type User = {
    discordId: string,
    anilistId: string
}

export type Server = {
    id: string,
    premium: boolean,
    users: Array<User>
}