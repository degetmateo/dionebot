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
exports.Media = void 0;
class Media {
    static BuscarMedia(bot, tipo, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const variables = {
                search: args,
                type: tipo.toUpperCase(),
                page: 1,
                perPage: 1
            };
            const response = yield bot.request(queryName, variables);
            return (response == null || response.Page == null || response.Page.media == null || response.Page.media[0] == null) ?
                null : response.Page.media[0].id;
        });
    }
    static GetDatosMedia(bot, tipo, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const variables = {
                id: parseInt(args),
                type: tipo.toUpperCase()
            };
            const response = yield bot.request(queryID, variables);
            return (response == null || response.Media == null) ? null : response.Media;
        });
    }
}
exports.Media = Media;
const queryName = `
    query ($page: Int, $perPage: Int, $search: String, $type: MediaType) {
        Page (page: $page, perPage: $perPage) {
            pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
            }
            media (search: $search, type: $type) {
                id
                idMal
                title {
                    english
                    romaji
                    native
                }
                type
                format
                status
                description
                season
                seasonYear
                episodes
                duration
                chapters
                volumes
                coverImage {
                    extraLarge
                }
                genres
                synonyms
                meanScore
                popularity
                favourites
                siteUrl
            }
        }
    }
`;
const queryID = `
    query ($id: Int, $type: MediaType) { # Define which variables will be used in the query (id)
        Media (id: $id, type: $type) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
            id
            idMal
            title {
                english
                romaji
                native
            }
            type
            format
            status
            description
            season
            seasonYear
            episodes
            duration
            chapters
            volumes
            coverImage {
                extraLarge
            }
            genres
            synonyms
            meanScore
            popularity
            favourites
            siteUrl
        }
    }
`;
