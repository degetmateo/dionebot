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
exports.BuscarUsuario = void 0;
const AniUser_1 = require("../models/AniUser");
function BuscarUsuario(bot, args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isNaN(parseInt(args))) {
            const variables = {
                name: args
            };
            const data = yield bot.request(queryUsername, variables);
            return (data == null || data.User == null) ? null : data.User;
        }
        else {
            const user = yield AniUser_1.AniUser.findOne({ discordId: args });
            if (!user)
                return null;
            const variables = {
                name: user === null || user === void 0 ? void 0 : user.anilistUsername
            };
            const data = yield bot.request(queryUsername, variables);
            return (data == null || data.User == null) ? null : data.User;
        }
    });
}
exports.BuscarUsuario = BuscarUsuario;
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
