import { Fetch } from "./Fetch";
import Aniuser from "../modelos/Aniuser";

class Usuarios {
    public static async BuscarUsuario(serverID: string, args: string): Promise<any> {
        if (isNaN(+args) || isNaN(parseFloat(args))) {
            const variables = {
                name: args
            };

            const response = await Fetch.request(QUERY_USERNAME, variables);

            return (response == null || response.User == null) ? null : response.User;
        } else {
            const user = await Aniuser.findOne({ serverId: serverID, discordId: args });

            if (!user) return null;
    
            const variables = {
                name: user.anilistUsername
            }
    
            const response = await Fetch.request(QUERY_USERNAME, variables);
            return (response == null || response.User == null) ? null : response.User;
        }
    }

    public static async GetEntradas(username: string): Promise<any> {
        const variables = { username };
        const response = await Fetch.request(QUERY_LISTAS, variables);
        return (response == null) ? null : response;
    }

    public static GetEntradasAnime = async (username: string): Promise<any> => {
        const variables = { username };
        const response = await Fetch.request(QUERY_LISTA_ANIMES, variables);
        return (response == null) ? null : response;
    }

    public static GetEntradasManga = async (username: string): Promise<any> => {
        const variables = { username };
        const response = await Fetch.request(QUERY_LISTA_MANGAS, variables);
        return (response == null) ? null : response;
    }

    public static async GetStatsMedia(uID: any, mID: string): Promise<any> {
        const userID = parseInt(uID);
        const mediaID = parseInt(mID);
    
        const variables = { userID, mediaID };
    
        const response = await Fetch.request(QUERY_MEDIA, variables);
    
        return (response == null || response.MediaList == null) ? null : response.MediaList;
    }
}

export { Usuarios };

const QUERY_USERNAME = `
    query ($name: String) {
        User(name: $name) {
            name
            id
            about
            avatar {
                large
                medium
            }
            bannerImage
            options {
                profileColor
            }
            statistics {
                anime {
                    count
                    meanScore
                    standardDeviation
                    minutesWatched
                    episodesWatched
                    formats {
                        count
                        format
                    }
                    statuses {
                        count
                        status
                    }
                    releaseYears {
                        count
                        releaseYear
                    }
                    startYears {
                        count
                        startYear
                    }
                    genres {
                        count
                        genre
                        meanScore
                        minutesWatched
                    }
                }
                manga {
                    count
                    meanScore
                    standardDeviation
                    chaptersRead
                    volumesRead
                    statuses {
                        count
                        status
                    }
                    releaseYears {
                        count
                        releaseYear
                    }
                    startYears {
                        count
                        startYear
                    }
                    genres {
                        count
                        genre
                        meanScore
                        chaptersRead
                    }
                }
            }
            siteUrl
            updatedAt
        }
    }
`;

const QUERY_LISTAS = `
    query ($username: String) {
        animeList: MediaListCollection(userName: $username, type: ANIME) {
            user {
                name
                avatar {
                    large
                }
                options {
                    profileColor
                }
                siteUrl
            }
            lists {
                entries {
                    mediaId,
                    score(format: POINT_100)
                }
                status
            }
        }
        mangaList: MediaListCollection(userName: $username, type: MANGA) {
            lists {
                entries {
                    mediaId,
                    score(format: POINT_100)
                }
            }
        }
    }
`;

const QUERY_LISTA_ANIMES = `
    query ($username: String) {
        animeList: MediaListCollection(userName: $username, type: ANIME) {
            lists {
                entries {
                    mediaId,
                    score(format: POINT_100)
                }
                status
            }
        }
    }
`;

const QUERY_LISTA_MANGAS = `
    query ($username: String) {
        mangaList: MediaListCollection(userName: $username, type: MANGA) {
            lists {
                entries {
                    mediaId,
                    score(format: POINT_100)
                }
            }
        }
    }
`;

const QUERY_MEDIA = `
    query ($userID: Int, $mediaID: Int) {
        MediaList(userId: $userID, mediaId: $mediaID) {
            id
            mediaId
            status
            score(format: POINT_100)
            progress
            repeat
        }
    }
`;