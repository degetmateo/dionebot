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
exports.__esModule = true;
exports.Media = void 0;
var Fetch_1 = require("./Fetch");
var Media = /** @class */ (function () {
    function Media() {
    }
    Media.BuscarMedia = function (tipo, args) {
        return __awaiter(this, void 0, void 0, function () {
            var variables, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        variables = {
                            search: args,
                            type: tipo.toUpperCase(),
                            page: 1,
                            perPage: 1
                        };
                        return [4 /*yield*/, Fetch_1.Fetch.request(queryName, variables)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (response == null || response.Page == null || response.Page.media == null || response.Page.media[0] == null) ?
                                null : response.Page.media[0]];
                }
            });
        });
    };
    Media.BuscarMediaID = function (tipo, id) {
        return __awaiter(this, void 0, void 0, function () {
            var variables, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        variables = {
                            id: parseInt(id),
                            type: tipo.toUpperCase()
                        };
                        return [4 /*yield*/, Fetch_1.Fetch.request(queryID, variables)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (response == null || response.Media == null) ? null : response.Media];
                }
            });
        });
    };
    return Media;
}());
exports.Media = Media;
var queryName = "\n    query ($page: Int, $perPage: Int, $search: String, $type: MediaType) {\n        Page (page: $page, perPage: $perPage) {\n            pageInfo {\n                total\n                currentPage\n                lastPage\n                hasNextPage\n                perPage\n            }\n            media (search: $search, type: $type) {\n                id\n                idMal\n                title {\n                    english\n                    romaji\n                    native\n                }\n                type\n                format\n                status\n                description\n                season\n                seasonYear\n                episodes\n                duration\n                chapters\n                volumes\n                studios {\n                    nodes {\n                        id\n                        name\n                        siteUrl\n                    }\n                }\n                coverImage {\n                    extraLarge\n                }\n                genres\n                synonyms\n                meanScore\n                popularity\n                favourites\n                siteUrl\n            }\n        }\n    }\n";
var queryID = "\n    query ($id: Int, $type: MediaType) { # Define which variables will be used in the query (id)\n        Media (id: $id, type: $type) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)\n            id\n            idMal\n            title {\n                english\n                romaji\n                native\n            }\n            type\n            format\n            status\n            description\n            season\n            seasonYear\n            episodes\n            duration\n            chapters\n            volumes\n            studios {\n                nodes {\n                    id\n                    name\n                    siteUrl\n                }\n            }\n            coverImage {\n                extraLarge\n            }\n            genres\n            synonyms\n            meanScore\n            popularity\n            favourites\n            siteUrl\n        }\n    }\n";
