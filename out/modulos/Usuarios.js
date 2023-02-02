"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuarios = void 0;
const Fetch_1 = require("./Fetch");
const Aniuser_1 = __importDefault(require("../modelos/Aniuser"));
class Usuarios {
    static async BuscarUsuario(serverID, args) {
        if (isNaN(+args) || isNaN(parseFloat(args))) {
            const variables = {
                name: args
            };
            const response = await Fetch_1.Fetch.request(QUERY_USERNAME, variables);
            return (response == null || response.User == null) ? null : response.User;
        }
        else {
            const user = await Aniuser_1.default.findOne({ serverId: serverID, discordId: args });
            if (!user)
                return null;
            const variables = {
                name: user.anilistUsername
            };
            const response = await Fetch_1.Fetch.request(QUERY_USERNAME, variables);
            return (response == null || response.User == null) ? null : response.User;
        }
    }
    static async GetUsuariosMedia(serverID, media) {
        const uRegistrados = await Aniuser_1.default.find({ serverId: serverID });
        const uMedia = [];
        for (let i = 0; i < uRegistrados.length; i++) {
            const uLista = await this.GetStatsMedia(uRegistrados[i].anilistId, media.getID());
            if (uLista != null) {
                uLista.username = uRegistrados[i].anilistUsername;
                uLista.discordId = uRegistrados[i].discordId;
                uMedia.push(uLista);
            }
        }
        const uMapeados = [];
        for (let i = 0; i < uMedia.length; i++) {
            const u = {
                name: uMedia[i].username,
                status: uMedia[i].status,
                progress: uMedia[i].progress,
                score: uMedia[i].score,
                repeat: uMedia[i].repeat
            };
            uMapeados.push(u);
        }
        return uMapeados;
    }
    static async GetEntradas(username) {
        const variables = { username };
        const response = await Fetch_1.Fetch.request(QUERY_LISTAS, variables);
        return (response == null) ? null : response;
    }
    static async GetStatsMedia(uID, mID) {
        const userID = parseInt(uID);
        const mediaID = parseInt(mID);
        const variables = { userID, mediaID };
        const response = await Fetch_1.Fetch.request(QUERY_MEDIA, variables);
        return (response == null || response.MediaList == null) ? null : response.MediaList;
    }
}
exports.Usuarios = Usuarios;
_a = Usuarios;
Usuarios.GetEntradasAnime = async (username) => {
    const variables = { username };
    const response = await Fetch_1.Fetch.request(QUERY_LISTA_ANIMES, variables);
    return (response == null) ? null : response;
};
Usuarios.GetEntradasManga = async (username) => {
    const variables = { username };
    const response = await Fetch_1.Fetch.request(QUERY_LISTA_MANGAS, variables);
    return (response == null) ? null : response;
};
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
