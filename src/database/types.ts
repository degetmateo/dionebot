export type UserSchema = {
    id_user: number,
    id_anilist: number,
    token_anilist: string
}

export type ServerSchema = {
    id_server: number,
    user_count: number
}

export type MembershipSchema = {
    id_user: number,
    id_server: number
}

export type ErrorSchema = {
    id_error: number,
    operation: string,
    date_error: string,
    description: string,
    stack: string
}