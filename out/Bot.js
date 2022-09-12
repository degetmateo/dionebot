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
const Anime_1 = require("./Anime");
const Manga_1 = require("./Manga");
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
    buscar(type, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            query ($id: Int, $page: Int, $perPage: Int, $search: String) {
                Page (page: $page, perPage: $perPage) {
                    pageInfo {
                        total
                        currentPage
                        lastPage
                        hasNextPage
                        perPage
                    }
                    media (id: $id, type: ${type}, search: $search) {
                        id
                        title {
                            romaji
                        }
                    }
                }
            }
        `;
            // Define our query variables and values that will be used in the query request
            const variables = {
                search: name,
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
            return yield this.cargar(type, meta.data.Page.media);
        });
    }
    cargar(type, media) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            query ($id: Int) { # Define which variables will be used in the query (id)
                Media (id: $id, type: ${type}) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    description
                }
            }
        `;
            // Define our query variables and values that will be used in the query request
            var variables = {
                id: media[0].id
            };
            // Define the config we'll need for our Api request
            var url = 'https://graphql.anilist.co', opciones = {
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
            if (type == "ANIME") {
                return new Anime_1.Anime(req.data.Media.id, req.data.Media.title, req.data.Media.description);
            }
            else {
                return new Manga_1.Manga(req.data.Media.id, req.data.Media.title, req.data.Media.description);
            }
        });
    }
}
exports.BOT = BOT;
