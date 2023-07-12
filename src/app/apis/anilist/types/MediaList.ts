export type MediaList = {
    user: {
        name: string
    },
    id: number,
    mediaId: number,
    status: MediaListEstado,
    score: number,
    progress: number,
    repeat: number
}

export type MediaListEstado = 'COMPLETED' | 'CURRENT' | 'DROPPED' | 'PLANNING' | 'PAUSED';