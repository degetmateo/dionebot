export default class AffinityCommandQueries {
    public static CreateUserCompletedMediaQuery (anilistId: string) {
        return `
            query {
                coleccion: MediaListCollection (userId: ${anilistId}, type: ANIME, status: COMPLETED) {
                    user {
                        id
                        statistics {
                            anime {
                                standardDeviation
                                meanScore
                            }
                        }
                    }
                    lists {
                        entries {
                            mediaId
                            score(format: POINT_100)
                        }
                    }
                }
            }
        `;
    }
}

export type Coleccion = {
    user: {
        id: number,
        statistics: {
            anime: {
                standardDeviation: number,
                meanScore: number
            }
        }
    },
    lists: Array<{
        entries: Array<{
            mediaId: number,
            score: number
        }>
    }>
}