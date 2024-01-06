"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const BuscadorMedia_1 = __importDefault(require("./modulos/BuscadorMedia"));
const BuscadorMediaTemporada_1 = __importDefault(require("./modulos/BuscadorMediaTemporada"));
const BuscadorUsuario_1 = __importDefault(require("./modulos/BuscadorUsuario"));
const BuscadorEstadoMediaUsuarios_1 = __importDefault(require("./modulos/BuscadorEstadoMediaUsuarios"));
const BuscadorListasCompletasUsuarios_1 = __importDefault(require("./modulos/BuscadorListasCompletasUsuarios"));
const ErrorDemasiadasPeticiones_1 = __importDefault(require("../../../errores/ErrorDemasiadasPeticiones"));
const ErrorSinResultados_1 = __importDefault(require("../../../errores/ErrorSinResultados"));
const Anime_1 = __importDefault(require("./modelos/media/Anime"));
const ScoreCollection_1 = __importDefault(require("./ScoreCollection"));
class AnilistAPI {
    static async fetchAnimeById(id) {
        return new Anime_1.default(await BuscadorMedia_1.default.BuscarMediaPorID(id, 'ANIME'));
    }
    static async fetchAnimeByName(name) {
        return (await BuscadorMedia_1.default.BuscarMediaPorNombre(name, 'ANIME')).map(r => new Anime_1.default(r));
    }
    static async fetchUsersScores(mediaId, usersIds) {
        return new ScoreCollection_1.default(await BuscadorEstadoMediaUsuarios_1.default.BuscarEstadoMediaUsuarios(mediaId, usersIds));
    }
    static async buscarMangaPorID(id) {
        return await BuscadorMedia_1.default.BuscarMediaPorID(id, 'MANGA');
    }
    static async buscarAnimePorNombre(criterio) {
        return await BuscadorMedia_1.default.BuscarMediaPorNombre(criterio, 'ANIME');
    }
    static async buscarMangaPorNombre(criterio) {
        return await BuscadorMedia_1.default.BuscarMediaPorNombre(criterio, 'MANGA');
    }
    static async buscarAnimesTemporada(anio, temporada) {
        return await BuscadorMediaTemporada_1.default.buscarAnimesTemporada(anio, temporada);
    }
    static async buscarUsuario(criterio) {
        return await BuscadorUsuario_1.default.BuscarUsuario(criterio);
    }
    static async buscarEstadoMediaUsuarios(mediaId, usersIds) {
        return await BuscadorEstadoMediaUsuarios_1.default.BuscarEstadoMediaUsuarios(mediaId, usersIds);
    }
    static async buscarListasCompletadosUsuarios(usuario, usuarios) {
        const mediaUsuario = await BuscadorListasCompletasUsuarios_1.default.BuscarListaCompletadosUsuario(usuario.obtenerID());
        const mediaUsuarios = await BuscadorListasCompletasUsuarios_1.default.BuscarListasCompletadosUsuarios(usuarios);
        return { user: mediaUsuario, users: mediaUsuarios };
    }
    static async peticion(query, variables) {
        const opciones = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
            body: JSON.stringify({ query, variables })
        };
        const data = await (0, node_fetch_1.default)(this.API_URL, opciones);
        if (!data)
            throw new ErrorSinResultados_1.default('No se han encontrado resultados.');
        const res = await data.json();
        if (res.errors) {
            const e = res.errors[0];
            const message = e.message.toLowerCase();
            if (message.includes('not found')) {
                throw new ErrorSinResultados_1.default('QUERY: No se han encontrado resultados.');
            }
            if (message.includes('max query complexity')) {
                console.error(e);
                throw new ErrorDemasiadasPeticiones_1.default('Se han realizado demasiadas peticiones al servidor. Intentalo de nuevo mas tarde.');
            }
            throw new Error(message);
        }
        if (!res || !res.data)
            throw new ErrorSinResultados_1.default('No se han encontrado resultados.');
        return res.data;
    }
    static async obtenerTokenDeAcceso(codigo) {
        const opciones = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
            body: JSON.stringify({
                'grant_type': 'authorization_code',
                'client_id': process.env.CLIENTE_ANILIST_ID,
                'client_secret': process.env.CLIENTE_ANILIST_TOKEN,
                'redirect_uri': process.env.URL_REDIRECCION,
                'code': codigo,
            })
        };
        (0, node_fetch_1.default)(this.URL_AUTORIZACION, opciones)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err));
    }
}
AnilistAPI.API_URL = "https://graphql.anilist.co";
AnilistAPI.RESULTADOS_PAGINA = 10;
AnilistAPI.CANTIDAD_CONSULTAS_POR_PETICION = 10;
AnilistAPI.URL_AUTORIZACION = 'https://anilist.co/api/v2/oauth/token';
exports.default = AnilistAPI;
