export type MediaCollection = {
    user: { id: number, name: string },
    lists: Array<{ status: MediaStatus, entries: Array<{ mediaId: number, score: number }> }>,
}

export type MediaStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';