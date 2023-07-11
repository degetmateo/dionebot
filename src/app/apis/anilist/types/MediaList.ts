export type MediaList = {
    user: {
        name: string
    },
    id: number,
    mediaId: number,
    status: EstadoMedia,
    score: number,
    progress: number,
    repeat: number
}

export type EstadoMedia = 'COMPLETED' | 'CURRENT' | 'DROPPED' | 'PLANNING' | 'PAUSED';