export type UserSchema = {
    id_user: number,
    id_anilist: number
}

export type ServerSchema = {
    id_server: number,
    user_count: number
}

export type MembershipSchema = {
    id_user: number,
    id_server: number
}