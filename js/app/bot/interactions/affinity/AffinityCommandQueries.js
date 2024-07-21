"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AffinityCommandQueries {
    static CreateUserCompletedMediaQuery(anilistId) {
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
exports.default = AffinityCommandQueries;
