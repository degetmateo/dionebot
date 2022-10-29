"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuarios = void 0;
const Fetch_1 = require("./Fetch");
const User_1 = require("../modelos_db/User");
class Usuarios {
    static BuscarUsuario(serverID, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(+args) || isNaN(parseFloat(args))) {
                const variables = {
                    name: args
                };
                const response = yield Fetch_1.Fetch.request(QUERY_USERNAME, variables);
                return (response == null || response.User == null) ? null : response.User;
            }
            else {
                const user = yield User_1.User.findOne({ serverId: serverID, discordId: args });
                if (!user)
                    return null;
                const variables = {
                    name: user.anilistUsername
                };
                const response = yield Fetch_1.Fetch.request(QUERY_USERNAME, variables);
                return (response == null || response.User == null) ? null : response.User;
            }
        });
    }
    static GetUsuariosMedia(serverID, media) {
        return __awaiter(this, void 0, void 0, function* () {
            const uRegistrados = yield User_1.User.find({ serverId: serverID });
            const uMedia = [];
            for (let i = 0; i < uRegistrados.length; i++) {
                const uLista = yield this.GetStatsMedia(uRegistrados[i].anilistId, media.getID());
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
                    score: uMedia[i].score
                };
                uMapeados.push(u);
            }
            return uMapeados;
        });
    }
    static GetEntradas(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const variables = { username };
            const response = yield Fetch_1.Fetch.request(QUERY_LISTAS, variables);
            return (response == null) ? null : response;
        });
    }
    static GetStatsMedia(uID, mID) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = parseInt(uID);
            const mediaID = parseInt(mID);
            const variables = { userID, mediaID };
            const response = yield Fetch_1.Fetch.request(QUERY_MEDIA, variables);
            return (response == null || response.MediaList == null) ? null : response.MediaList;
        });
    }
}
exports.Usuarios = Usuarios;
_a = Usuarios;
Usuarios.GetEntradasAnime = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const variables = { username };
    const response = yield Fetch_1.Fetch.request(QUERY_LISTA_ANIMES, variables);
    return (response == null) ? null : response;
});
Usuarios.GetEntradasManga = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const variables = { username };
    const response = yield Fetch_1.Fetch.request(QUERY_LISTA_MANGAS, variables);
    return (response == null) ? null : response;
});
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
        }
    }
`;
