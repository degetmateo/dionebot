"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const AnilistUser_1 = __importDefault(require("./modelos/AnilistUser"));
const BuscadorMedia_1 = __importDefault(require("./modulos/BuscadorMedia"));
const BuscadorMediaTemporada_1 = __importDefault(require("./modulos/BuscadorMediaTemporada"));
const BuscadorUsuario_1 = __importDefault(require("./modulos/BuscadorUsuario"));
const BuscadorEstadoMediaUsuarios_1 = __importDefault(require("./modulos/BuscadorEstadoMediaUsuarios"));
const BuscadorListasCompletasUsuarios_1 = __importDefault(require("./modulos/BuscadorListasCompletasUsuarios"));
const Anime_1 = __importDefault(require("./modelos/media/Anime"));
const ScoreCollection_1 = __importDefault(require("./ScoreCollection"));
const Manga_1 = __importDefault(require("./modelos/media/Manga"));
const NoResultsException_1 = __importDefault(require("../../../errors/NoResultsException"));
const TooManyRequestsException_1 = __importDefault(require("../../../errors/TooManyRequestsException"));
class AnilistAPI {
    static async fetchAnimeById(id) {
        return new Anime_1.default(await BuscadorMedia_1.default.BuscarMediaPorID(id, 'ANIME'));
    }
    static async fetchAnimeByName(name) {
        return (await BuscadorMedia_1.default.BuscarMediaPorNombre(name, 'ANIME')).map(r => new Anime_1.default(r));
    }
    static async fetchMangaById(id) {
        return new Manga_1.default(await BuscadorMedia_1.default.BuscarMediaPorID(id, 'MANGA'));
    }
    static async fetchMangaByName(name) {
        return (await BuscadorMedia_1.default.BuscarMediaPorNombre(name, 'MANGA')).map(r => new Manga_1.default(r));
    }
    static async fetchUserById(id) {
        const result = await BuscadorUsuario_1.default.BuscarUsuario(id);
        return result ? new AnilistUser_1.default(result) : null;
    }
    static async fetchUserByName(name) {
        return new AnilistUser_1.default(await BuscadorUsuario_1.default.BuscarUsuario(name));
    }
    static async fetchUsersScores(mediaId, usersIds) {
        return new ScoreCollection_1.default(await BuscadorEstadoMediaUsuarios_1.default.BuscarEstadoMediaUsuarios(mediaId, usersIds));
    }
    static async fetchUserPlannedAnimes(userId) {
        const request = `
            query {                
                MediaListCollection (userId: ${userId}, type: ANIME, status: PLANNING) {
                    ...mediaListCollection
                }
            }

            fragment mediaListCollection on MediaListCollection {
                lists {
                    entries {
                        mediaId
                    }
                }
            }
        `;
        const res = await AnilistAPI.peticion(request, {});
        return res.MediaListCollection;
    }
    static async fetchUsersCompletedLists(user, usersIds) {
        const mediaUsuario = await BuscadorListasCompletasUsuarios_1.default.BuscarListaCompletadosUsuario(user.getId());
        const mediaUsuarios = await BuscadorListasCompletasUsuarios_1.default.BuscarListasCompletadosUsuarios(usersIds);
        return { user: mediaUsuario, users: mediaUsuarios };
    }
    static async fetchSeasonAnimes(year, season) {
        return await BuscadorMediaTemporada_1.default.buscarAnimesTemporada(year, season);
    }
    static async buscarUsuario(criterio) {
        return await BuscadorUsuario_1.default.BuscarUsuario(criterio);
    }
    static async buscarEstadoMediaUsuarios(mediaId, usersIds) {
        return await BuscadorEstadoMediaUsuarios_1.default.BuscarEstadoMediaUsuarios(mediaId, usersIds);
    }
    static async peticion(query, variables) {
        const opciones = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
            body: JSON.stringify({ query, variables })
        };
        const data = await (0, node_fetch_1.default)(this.API_URL, opciones);
        if (!data)
            throw new NoResultsException_1.default('No se han encontrado resultados.');
        const res = await data.json();
        if (res.errors) {
            const e = res.errors[0];
            const message = e.message.toLowerCase();
            if (message.includes('not found')) {
                throw new NoResultsException_1.default('No se han encontrado resultados.');
            }
            if (message.includes('max query complexity')) {
                console.error(e);
                throw new TooManyRequestsException_1.default('Se han realizado demasiadas peticiones al servidor. Inténtalo de nuevo más tarde.');
            }
            if (message.includes('too many requests')) {
                console.error(e);
                throw new TooManyRequestsException_1.default('Se han realizado demasiadas peticiones al servidor. Inténtalo de nuevo más tarde.');
            }
            throw new Error(message);
        }
        if (!res || !res.data)
            throw new NoResultsException_1.default('No se han encontrado resultados.');
        return res.data;
    }
    static async authorizedFetch(token, query) {
        const res = await (0, node_fetch_1.default)(this.API_URL, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        return await res.json();
    }
}
AnilistAPI.API_URL = "https://graphql.anilist.co";
AnilistAPI.RESULTADOS_PAGINA = 10;
AnilistAPI.CANTIDAD_CONSULTAS_POR_PETICION = 10;
AnilistAPI.AUTH_URL = 'https://anilist.co/api/v2/oauth/token';
exports.default = AnilistAPI;
