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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Usuarios = void 0;
var Fetch_1 = require("./Fetch");
var Aniuser_1 = __importDefault(require("../modelos/Aniuser"));
var Usuarios = /** @class */ (function () {
    function Usuarios() {
    }
    Usuarios.BuscarUsuario = function (serverID, args) {
        return __awaiter(this, void 0, void 0, function () {
            var variables, response, user, variables, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(isNaN(+args) || isNaN(parseFloat(args)))) return [3 /*break*/, 2];
                        variables = {
                            name: args
                        };
                        return [4 /*yield*/, Fetch_1.Fetch.request(QUERY_USERNAME, variables)];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, (response == null || response.User == null) ? null : response.User];
                    case 2: return [4 /*yield*/, Aniuser_1["default"].findOne({ serverId: serverID, discordId: args })];
                    case 3:
                        user = _b.sent();
                        if (!user)
                            return [2 /*return*/, null];
                        variables = {
                            name: user.anilistUsername
                        };
                        return [4 /*yield*/, Fetch_1.Fetch.request(QUERY_USERNAME, variables)];
                    case 4:
                        response = _b.sent();
                        return [2 /*return*/, (response == null || response.User == null) ? null : response.User];
                }
            });
        });
    };
    Usuarios.GetUsuariosMedia = function (serverID, media) {
        return __awaiter(this, void 0, void 0, function () {
            var uRegistrados, uMedia, i, uLista, uMapeados, i, u;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Aniuser_1["default"].find({ serverId: serverID })];
                    case 1:
                        uRegistrados = _b.sent();
                        uMedia = [];
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < uRegistrados.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.GetStatsMedia(uRegistrados[i].anilistId, media.getID())];
                    case 3:
                        uLista = _b.sent();
                        if (uLista != null) {
                            uLista.username = uRegistrados[i].anilistUsername;
                            uLista.discordId = uRegistrados[i].discordId;
                            uMedia.push(uLista);
                        }
                        _b.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        uMapeados = [];
                        for (i = 0; i < uMedia.length; i++) {
                            u = {
                                name: uMedia[i].username,
                                status: uMedia[i].status,
                                progress: uMedia[i].progress,
                                score: uMedia[i].score
                            };
                            uMapeados.push(u);
                        }
                        return [2 /*return*/, uMapeados];
                }
            });
        });
    };
    Usuarios.GetEntradas = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var variables, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        variables = { username: username };
                        return [4 /*yield*/, Fetch_1.Fetch.request(QUERY_LISTAS, variables)];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, (response == null) ? null : response];
                }
            });
        });
    };
    Usuarios.GetStatsMedia = function (uID, mID) {
        return __awaiter(this, void 0, void 0, function () {
            var userID, mediaID, variables, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userID = parseInt(uID);
                        mediaID = parseInt(mID);
                        variables = { userID: userID, mediaID: mediaID };
                        return [4 /*yield*/, Fetch_1.Fetch.request(QUERY_MEDIA, variables)];
                    case 1:
                        response = _b.sent();
                        return [2 /*return*/, (response == null || response.MediaList == null) ? null : response.MediaList];
                }
            });
        });
    };
    var _a;
    _a = Usuarios;
    Usuarios.GetEntradasAnime = function (username) { return __awaiter(void 0, void 0, void 0, function () {
        var variables, response;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    variables = { username: username };
                    return [4 /*yield*/, Fetch_1.Fetch.request(QUERY_LISTA_ANIMES, variables)];
                case 1:
                    response = _b.sent();
                    return [2 /*return*/, (response == null) ? null : response];
            }
        });
    }); };
    Usuarios.GetEntradasManga = function (username) { return __awaiter(void 0, void 0, void 0, function () {
        var variables, response;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    variables = { username: username };
                    return [4 /*yield*/, Fetch_1.Fetch.request(QUERY_LISTA_MANGAS, variables)];
                case 1:
                    response = _b.sent();
                    return [2 /*return*/, (response == null) ? null : response];
            }
        });
    }); };
    return Usuarios;
}());
exports.Usuarios = Usuarios;
var QUERY_USERNAME = "\n    query ($name: String) {\n        User(name: $name) {\n            name\n            id\n            about\n            avatar {\n                large\n                medium\n            }\n            bannerImage\n            options {\n                profileColor\n            }\n            statistics {\n                anime {\n                    count\n                    meanScore\n                    standardDeviation\n                    minutesWatched\n                    episodesWatched\n                    formats {\n                        count\n                        format\n                    }\n                    statuses {\n                        count\n                        status\n                    }\n                    releaseYears {\n                        count\n                        releaseYear\n                    }\n                    startYears {\n                        count\n                        startYear\n                    }\n                    genres {\n                        count\n                        genre\n                        meanScore\n                        minutesWatched\n                    }\n                }\n                manga {\n                    count\n                    meanScore\n                    standardDeviation\n                    chaptersRead\n                    volumesRead\n                    statuses {\n                        count\n                        status\n                    }\n                    releaseYears {\n                        count\n                        releaseYear\n                    }\n                    startYears {\n                        count\n                        startYear\n                    }\n                    genres {\n                        count\n                        genre\n                        meanScore\n                        chaptersRead\n                    }\n                }\n            }\n            siteUrl\n            updatedAt\n        }\n    }\n";
var QUERY_LISTAS = "\n    query ($username: String) {\n        animeList: MediaListCollection(userName: $username, type: ANIME) {\n            user {\n                name\n                avatar {\n                    large\n                }\n                options {\n                    profileColor\n                }\n                siteUrl\n            }\n            lists {\n                entries {\n                    mediaId,\n                    score(format: POINT_100)\n                }\n                status\n            }\n        }\n        mangaList: MediaListCollection(userName: $username, type: MANGA) {\n            lists {\n                entries {\n                    mediaId,\n                    score(format: POINT_100)\n                }\n            }\n        }\n    }\n";
var QUERY_LISTA_ANIMES = "\n    query ($username: String) {\n        animeList: MediaListCollection(userName: $username, type: ANIME) {\n            lists {\n                entries {\n                    mediaId,\n                    score(format: POINT_100)\n                }\n                status\n            }\n        }\n    }\n";
var QUERY_LISTA_MANGAS = "\n    query ($username: String) {\n        mangaList: MediaListCollection(userName: $username, type: MANGA) {\n            lists {\n                entries {\n                    mediaId,\n                    score(format: POINT_100)\n                }\n            }\n        }\n    }\n";
var QUERY_MEDIA = "\n    query ($userID: Int, $mediaID: Int) {\n        MediaList(userId: $userID, mediaId: $mediaID) {\n            id\n            mediaId\n            status\n            score(format: POINT_100)\n            progress\n        }\n    }\n";
