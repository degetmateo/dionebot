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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuarios = void 0;
const AniUser_1 = require("../models/AniUser");
class Usuarios {
    static BuscarUsuario(bot, serverID, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(+args) || isNaN(parseFloat(args))) {
                const variables = {
                    name: args
                };
                const data = yield bot.request(queryUsername, variables);
                return (data == null || data.User == null) ? null : data.User;
            }
            else {
                const user = yield AniUser_1.AniUser.findOne({ serverId: serverID, discordId: args });
                if (!user)
                    return null;
                const variables = {
                    name: user.anilistUsername
                };
                const data = yield bot.request(queryUsername, variables);
                return (data == null || data.User == null) ? null : data.User;
            }
        });
    }
    static GetUsuariosMedia(bot, serverID, media) {
        return __awaiter(this, void 0, void 0, function* () {
            const uRegistrados = yield AniUser_1.AniUser.find({ serverId: serverID });
            const uMedia = [];
            for (let i = 0; i < uRegistrados.length; i++) {
                const uLista = yield bot.buscarMediaUsuario(uRegistrados[i].anilistId, media.getID());
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
    static GetEntradas(bot, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const variables = { username };
            const response = yield bot.request(queryLista, variables);
            return (response == null) ? null : response;
        });
    }
    static GetStatsMedia(bot, uID, mID) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = parseInt(uID);
            const mediaID = parseInt(mID);
            const variables = { userID, mediaID };
            const response = yield bot.request(queryMedia, variables);
            return (response == null || response.MediaList == null) ? null : response.MediaList;
        });
    }
}
exports.Usuarios = Usuarios;
const queryUsername = `
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
const queryLista = `
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
const queryMedia = `
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
