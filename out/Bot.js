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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOT = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const discord_js_1 = require("discord.js");
const Obra_1 = require("./Obra");
class BOT {
    constructor(client) {
        this.client = client;
    }
    on(event, func) {
        this.client.on(event, func);
    }
    responder(message, text) {
        message.reply(text);
    }
    enviar(message, text) {
        message.channel.send(text);
    }
    enviarEmbed(message, embed) {
        message.channel.send({ embeds: [embed] });
    }
    enviarInfo(message, obra) {
        const EmbedInformacion = new discord_js_1.EmbedBuilder()
            .setTitle(obra.getTitulos().native)
            .setURL(obra.getURL())
            // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            .setDescription(obra.getDescripcion())
            .setThumbnail(obra.getCoverImageURL())
            // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            // .setImage('https://i.imgur.com/AfFp7pu.png')
            // .setTimestamp()
            .setFooter({ text: obra.getTitulos().romaji + " | " + obra.getTitulos().english });
        if (obra.getTipo() == "ANIME") {
            EmbedInformacion
                .setColor(0xff0000)
                .addFields({ name: "Tipo", value: obra.getTipo(), inline: true }, { name: "Formato", value: obra.getFormato(), inline: true }, { name: "Estado", value: obra.getEstado(), inline: true }, { name: "Calificación", value: obra.getPromedio() + "/100", inline: true }, { name: "Popularidad", value: obra.getPopularidad(), inline: true }, { name: "Favoritos", value: obra.getFavoritos(), inline: true }, { name: "Temporada", value: obra.getTemporada(), inline: true }, { name: "Episodios", value: obra.getEpisodios(), inline: true }, { name: "Duracion", value: obra.getDuracion(), inline: true });
        }
        else {
            EmbedInformacion
                .setColor(0xFFFF00)
                .addFields({ name: "Tipo", value: obra.getTipo(), inline: true }, { name: "Formato", value: obra.getFormato(), inline: true }, { name: "Estado", value: obra.getEstado(), inline: true }, { name: "Calificación", value: obra.getPromedio() + "/100", inline: true }, { name: "Popularidad", value: obra.getPopularidad(), inline: true }, { name: "Favoritos", value: obra.getFavoritos(), inline: true }, { name: "Temporada", value: obra.getTemporada(), inline: true }, { name: "Capítulos", value: obra.getCapitulos(), inline: true }, { name: "Volúmenes", value: obra.getVolumenes(), inline: true });
        }
        this.enviarEmbed(message, EmbedInformacion);
    }
    anime(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.buscar("ANIME", name);
        });
    }
    manga(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.buscar("MANGA", name);
        });
    }
    buscar(tipo, nombre) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
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
            // Define our query variables and values that will be used in the query request
            const variables = {
                search: nombre,
                type: tipo.toUpperCase(),
                page: 1,
                perPage: 1
            };
            // Define the config we'll need for our Api request
            const url = 'https://graphql.anilist.co';
            const opciones = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query, variables })
            };
            const response = yield (0, node_fetch_1.default)(url, opciones);
            const meta = yield response.json();
            return yield this.cargar(tipo, meta.data.Page.media[0].id);
        });
    }
    cargar(tipo, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                return null;
            const query = `
            query ($id: Int) { # Define which variables will be used in the query (id)
                Media (id: $id, type: ${tipo}) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
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
            // Define our query variables and values that will be used in the query request
            const variables = {
                id: id
            };
            // Define the config we'll need for our Api request
            const url = 'https://graphql.anilist.co';
            const opciones = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    variables: variables
                })
            };
            const response = yield (0, node_fetch_1.default)(url, opciones);
            const req = yield response.json();
            console.log(req.data.Media);
            if (!req.data.Media)
                return null;
            return new Obra_1.Obra(req.data.Media);
        });
    }
}
exports.BOT = BOT;
