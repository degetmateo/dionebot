type uRegistrado = {
    serverId: string,
    discordId: string,
    anilistUsername: string,
    anilistId: string
};

type sharedMedia = {
    id: number,
    scoreA: number,
    scoreB: number
}

type MediaStatus = "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS" | "UNKNOWN";

export { sharedMedia, MediaStatus, uRegistrado };