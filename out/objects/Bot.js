"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const toHex = __importStar(require("colornames"));
const discord_js_1 = require("discord.js");
const Obra_1 = require("./Obra");
const Usuario_1 = require("./Usuario");
const db_1 = require("../db");
const AniUser_1 = require("../models/AniUser");
const Mensaje_1 = require("./Mensaje");
class BOT {
    constructor(client, db) {
        this.client = client;
        this.db = db;
    }
    iniciar() {
        this.on("ready", () => console.log("BOT preparado!"));
        this.on("messageCreate", (message) => __awaiter(this, void 0, void 0, function* () {
            const mensaje = new Mensaje_1.Mensaje(message);
            const comando = mensaje.getComando();
            const args = mensaje.getArgumentos();
            if (comando === "Hola") {
                message.reply(`${message.client.emojis.cache.find((e => e.name === "pala"))}`);
            }
            ;
            if (comando == "!anime") {
                const anime = yield this.anime(args[0]);
                if (!anime)
                    return;
                this.enviarInfoMedia(message, anime);
            }
            if (comando == "!manga") {
                const manga = yield this.manga(args[0]);
                if (!manga)
                    return;
                this.enviarInfoMedia(message, manga);
            }
            if (comando == "!user") {
                let usuario;
                if (args[0].trim() == "" || !args[0]) {
                    const userID = message.author.id.toString();
                    usuario = yield this.usuario(userID, "id");
                }
                else {
                    usuario = yield this.usuario(args[0], "username");
                }
                if (!usuario) {
                    return message.react("❌");
                }
                else {
                    message.react("✅");
                }
                this.enviarInfoUser(message, usuario);
            }
            if (comando == "!setup") {
                const result = yield this.setup(args[0], message);
                if (result) {
                    message.react("✅");
                }
                else {
                    message.react("❌");
                }
            }
            if (comando == "!unsetup") {
                const result = yield this.unsetup(message);
                if (result) {
                    message.react("✅");
                }
                else {
                    message.react("❌");
                }
            }
            if (comando == "!afinidad") {
                let resultado;
                if (!args[0]) {
                    resultado = yield this.afinidad(message);
                }
                else {
                    resultado = false;
                }
                if (resultado) {
                    message.react("✅");
                }
                else {
                    message.react("❌");
                }
            }
            if (message.content.endsWith("13") || message.content.endsWith("trece")) {
                this.responder(message, "¿Dijiste 13? Aquí tiene pa' que me la bese, entre más me la beses más me crece, busca un cura pa' que me la rese, y trae un martillo pa' que me la endereces, por el chiquito se te aparece toas las veces y cuando te estreses aquí te tengo éste pa' que te desestreses, con este tallo el jopo se te esflorece, se cumple el ciclo hasta que anochece, to' los días y toas las veces, de tanto entablar la raja del jopo se te desaparece, porque este sable no se compadece, si pides ñapa se te ofrece, y si repites se te agradece, no te hace rico pero tampoco te empobrece, no te hace inteligente pero tampoco te embrutece, y no paro aquí compa que éste nuevamente se endurece, hasta que amanece, cambie esa cara que parece que se entristece, si te haces viejo éste te rejuvenece, no te hago bulla porque depronto te ensordece, y ese cuadro no te favorece, pero tranquilo que éste te abastece, porque allá abajo se te humedece, viendo como el que me cuelga resplandece, si a ti te da miedo a mí me enorgullece, y así toas las vece ¿que te parece?, y tranquilo mijo que aquí éste reaparece, no haga fuerza porque éste se sobrecrece, una fresadora te traigo pa' que me la freses, así se fortalece y de nuevo la historia se establece, que no se te nuble la vista porque éste te la aclarece, y sino le entendiste nuevamente la explicación se te ofrece, pa' que por el chiquito éste de nuevo te empiece... Aquí tienes para que me la beses, entre más me la beses más me crece, busca un cura para que me la rece, un martillo para que me la endereces, un chef para que me la aderece, 8000 mondas por el culo se te aparecen, si me la sobas haces que se me espese, si quieres la escaneas y te la llevas para que en tu hoja de vida la anexes, me culeo a tu maldita madre y qué te parece le meti la monda a tú mamá hace 9 meses y después la puse a escuchar René de Calle 13 Te la meto por debajo del agua como los peces, y aquella flor de monda que en tu culo crece, reposa sobre tus nalgas a veces y una vez más...");
            }
            ;
            if (message.content.endsWith("12") || message.content.endsWith("doce")) {
                this.responder(message, "las de doce son goood");
            }
            ;
            if (message.content.endsWith("5") || message.content.endsWith("cinco")) {
                this.responder(message, "por el culo te la hinco");
            }
            if (message.content.endsWith("contexto")) {
                this.responder(message, "Espera dijiste contexto? Te la tragas sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos y así terminó y te la meto sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos pero ya estás descompuesto así que para mí continuar sería incorrecto y me voy sin mostrar algún gesto, dispuesto a seguir apenas y ya estés compuesto voy y te doy el impuesto pero no sin antes avisarte que este es el contexto 👍.");
            }
        }));
        this.db.conectar(process.env.DB);
        this.client.login(process.env.TOKEN);
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
    enviarInfoMedia(message, obra) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
                const infoTEXT_1 = `
                ‣ **Tipo**: ${obra.getTipo()}\n‣ **Formato**: ${obra.getFormato()}\n‣ **Estado**: ${obra.getEstado()}\n‣ **Calificación**: ${obra.getPromedio()}/100
            `;
                const infoTEXT_2 = `
                ‣ **Popularidad**: ${obra.getPopularidad()}\n‣ **Favoritos**: ${obra.getFavoritos()}\n‣ **Temporada**: ${obra.getTemporada()}\n‣ **Año de Emisión**: ${obra.getAnioEmision()}\n‣ **Episodios**: ${obra.getEpisodios()}
            `;
                EmbedInformacion
                    .setColor(0xff0000)
                    .addFields({ name: "▽", value: infoTEXT_1, inline: true }, { name: "▽", value: infoTEXT_2, inline: true }
                // { name: "Tipo", value: obra.getTipo(), inline: true },
                // { name: "Formato", value: obra.getFormato(), inline: true },
                // { name: "Estado", value: obra.getEstado(), inline: true },
                // { name: "Calificación", value: obra.getPromedio() + "/100", inline: true },
                // { name: "Popularidad", value: obra.getPopularidad(), inline: true },
                // { name: "Favoritos", value: obra.getFavoritos(), inline: true },
                // { name: "Temporada", value: obra.getTemporada(), inline: true },
                // { name: "Episodios", value: obra.getEpisodios(), inline: true },
                // { name: "Duracion", value: obra.getDuracion(), inline: true }
                );
            }
            else {
                const infoTEXT_1 = `
                ‣ **Tipo**: ${obra.getTipo()}\n‣ **Formato**: ${obra.getFormato()}\n‣ **Estado**: ${obra.getEstado()}\n‣ **Calificación**: ${obra.getPromedio()}/100
            `;
                const infoTEXT_2 = `
                ‣ **Popularidad**: ${obra.getPopularidad()}\n‣ **Favoritos**: ${obra.getFavoritos()}\n‣ **Capítulos**: ${obra.getCapitulos()}\n‣ **Volúmenes**: ${obra.getVolumenes()}
            `;
                EmbedInformacion
                    .setColor(0xFFFF00)
                    .addFields({ name: "▽", value: infoTEXT_1, inline: true }, { name: "▽", value: infoTEXT_2, inline: true }
                // { name: "Tipo", value: obra.getTipo(), inline: true },
                // { name: "Formato", value: obra.getFormato(), inline: true },
                // { name: "Estado", value: obra.getEstado(), inline: true },
                // { name: "Calificación", value: obra.getPromedio() + "/100", inline: true },
                // { name: "Popularidad", value: obra.getPopularidad(), inline: true },
                // { name: "Favoritos", value: obra.getFavoritos(), inline: true },
                // { name: "Temporada", value: obra.getTemporada(), inline: true },
                // { name: "Capítulos", value: obra.getCapitulos(), inline: true },
                // { name: "Volúmenes", value: obra.getVolumenes(), inline: true }
                );
            }
            let generosInfo = "";
            const generos = obra.getGeneros();
            for (let i = 0; i < generos.length; i++) {
                generosInfo += "`" + generos[i] + "` - ";
            }
            generosInfo = generosInfo.substring(0, generosInfo.length - 3);
            EmbedInformacion
                .addFields({ name: "Géneros", value: generosInfo, inline: false });
            const users = yield db_1.DB.buscar((_a = message.guild) === null || _a === void 0 ? void 0 : _a.id.toString());
            const usuariosObra = [];
            if (users.length > 0) {
                for (let i = 0; i < users.length; i++) {
                    const userListInfo = yield this.buscarMedia(users[i].anilistId, obra.getID());
                    if (userListInfo != null) {
                        userListInfo.username = users[i].anilistUsername;
                        userListInfo.discordId = users[i].discordId;
                        usuariosObra.push(userListInfo);
                    }
                }
                const usuariosMapeados = [];
                for (let i = 0; i < usuariosObra.length; i++) {
                    // const discordUser = message.guild?.members.cache.find(m => m.id == usuariosObra[i].discordId);
                    if (parseFloat(usuariosObra[i].score.toString()) <= 10) {
                        usuariosObra[i].score = parseFloat((usuariosObra[i].score * 10).toString());
                    }
                    const u = {
                        name: usuariosObra[i].username,
                        status: usuariosObra[i].status,
                        progress: usuariosObra[i].progress,
                        score: parseFloat(usuariosObra[i].score.toString())
                    };
                    usuariosMapeados.push(u);
                }
                let completedTEXT = "";
                let inProgressTEXT = "";
                let droppedTEXT = "";
                let pausedListTEXT = "";
                let planningTEXT = "";
                for (let i = 0; i < usuariosMapeados.length; i++) {
                    if (usuariosMapeados[i].status == "COMPLETED") {
                        completedTEXT += `${usuariosMapeados[i].name} **[${usuariosMapeados[i].score}]** - `;
                    }
                    if (usuariosMapeados[i].status == "DROPPED") {
                        droppedTEXT += `${usuariosMapeados[i].name} **(${usuariosMapeados[i].progress})** **[${usuariosMapeados[i].score}]** - `;
                    }
                    if (usuariosMapeados[i].status == "CURRENT") {
                        inProgressTEXT += `${usuariosMapeados[i].name} **(${usuariosMapeados[i].progress})** **[${usuariosMapeados[i].score}]** - `;
                    }
                    if (usuariosMapeados[i].status == "PAUSED") {
                        pausedListTEXT += `${usuariosMapeados[i].name} **[${usuariosMapeados[i].score}]** - `;
                    }
                    if (usuariosMapeados[i].status == "PLANNING") {
                        planningTEXT += `${usuariosMapeados[i].name} - `;
                    }
                }
                if (completedTEXT.trim().endsWith("-")) {
                    completedTEXT = completedTEXT.substring(0, completedTEXT.length - 2);
                }
                if (droppedTEXT.trim().endsWith("-")) {
                    droppedTEXT = droppedTEXT.substring(0, droppedTEXT.length - 2);
                }
                if (inProgressTEXT.trim().endsWith("-")) {
                    inProgressTEXT = inProgressTEXT.substring(0, inProgressTEXT.length - 2);
                }
                if (pausedListTEXT.trim().endsWith("-")) {
                    pausedListTEXT = pausedListTEXT.substring(0, pausedListTEXT.length - 2);
                }
                if (planningTEXT.trim().endsWith("-")) {
                    planningTEXT = planningTEXT.substring(0, planningTEXT.length - 2);
                }
                if (completedTEXT.trim() == "") {
                    completedTEXT = "Nadie";
                }
                if (droppedTEXT.trim() == "") {
                    droppedTEXT = "Nadie";
                }
                if (inProgressTEXT.trim() == "") {
                    inProgressTEXT = "Nadie";
                }
                if (pausedListTEXT.trim() == "") {
                    pausedListTEXT = "Nadie";
                }
                if (planningTEXT.trim() == "") {
                    planningTEXT = "Nadie";
                }
                EmbedInformacion
                    .addFields({ name: "Terminados", value: completedTEXT, inline: false }, { name: "Dropeados", value: droppedTEXT, inline: false }, { name: "En Pausa", value: pausedListTEXT, inline: false }, { name: "En Progreso", value: inProgressTEXT, inline: false }, { name: "Planeados", value: planningTEXT, inline: false });
            }
            console.log(usuariosObra);
            this.enviarEmbed(message, EmbedInformacion);
        });
    }
    buscarMedia(userID, mediaID) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(userID);
            const mediaId = parseInt(mediaID);
            const query = `
            query ($id: Int, $mediaId: Int) {
                MediaList(userId: $id, mediaId: $mediaId) {
                    id
                    mediaId
                    status
                    score
                    progress
                }
            }`;
            const variables = {
                id: id,
                mediaId: mediaId
            };
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
            console.log("LISTA LISTA LISTA");
            console.log(id);
            if (!req.data)
                return null;
            console.log(req.data);
            return req.data.MediaList;
        });
    }
    buscarLista(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
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
            }`;
            const variables = {
                username: username
            };
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
            return req;
        });
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
    usuario(criterio, tipo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tipo == "username") {
                const query = `
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
            }`;
                const variables = {
                    name: criterio
                };
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
                if (!req.data.User)
                    return null;
                return new Usuario_1.Usuario(req.data.User);
            }
            else {
                const u = yield AniUser_1.AniUser.findOne({ discordId: criterio });
                if (u == null || u == undefined)
                    return null;
                const query = `
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
            }`;
                const variables = {
                    name: u.anilistUsername
                };
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
                if (!req.data.User)
                    return null;
                return new Usuario_1.Usuario(req.data.User);
            }
        });
    }
    enviarInfoUser(message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const hexColor = toHex.get(user.getColorName()).value;
            const color = "0x" + hexColor;
            const stats = user.getEstadisticas();
            const EmbedInformacion = new discord_js_1.EmbedBuilder()
                .setTitle(user.getNombre())
                .setURL(user.getURL())
                .setColor(color)
                .setThumbnail(user.getAvatarURL())
                .setImage(user.getBannerImage())
                .setDescription(user.getBio())
                .addFields({
                name: "Animes",
                value: `‣ Vistos: ${stats.anime.count}\n‣ Nota Promedio: ${stats.anime.meanScore}\n‣ Días Vistos: ${((stats.anime.minutesWatched / 60) / 24).toFixed()}\n‣ Episodios Totales: ${stats.anime.episodesWatched}`,
                inline: false
            }, {
                name: "Mangas",
                value: `‣ Leídos: ${stats.manga.count}\n‣ Nota Promedio: ${stats.manga.meanScore}\n‣ Capítulos Leídos: ${stats.manga.chaptersRead}\n‣ Volúmenes Leídos: ${stats.manga.volumesRead}`,
                inline: false
            });
            this.enviarEmbed(message, EmbedInformacion);
        });
    }
    setup(username, message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield this.usuario(username, "username");
            if (!usuario)
                return false;
            let svUsers = yield AniUser_1.AniUser.find({ serverId: message.guildId });
            let dbUser = svUsers.find(u => u.discordId == message.author.id);
            if (dbUser != null && dbUser != undefined)
                return false;
            const aniuser = new AniUser_1.AniUser();
            aniuser.anilistUsername = usuario.getNombre();
            aniuser.anilistId = usuario.getID();
            aniuser.discordId = message.author.id;
            aniuser.serverId = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id;
            aniuser.save((err) => {
                console.error(err);
                return false;
            });
            return true;
        });
    }
    unsetup(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const svUsers = yield AniUser_1.AniUser.find({ serverId: message.guildId });
            const result = svUsers.find(u => u.discordId == message.author.id);
            try {
                result === null || result === void 0 ? void 0 : result.delete();
                return true;
            }
            catch (err) {
                console.error(err);
                return false;
            }
        });
    }
    calcularAfinidad(l1, l2) {
        return __awaiter(this, void 0, void 0, function* () {
            let afinidad = 0;
            const cantidadAnimes = l1.length;
            for (let i = 0; i < l1.length; i++) {
                const l1MediaId = l1[i].mediaId;
                const l1MediaScore = l1[i].score;
                const sharedMedia = l2.find(e => e.mediaId == l1MediaId);
                if (!sharedMedia)
                    continue;
                if (sharedMedia.score == l1MediaScore)
                    afinidad++;
            }
            console.log(cantidadAnimes);
            console.log(afinidad);
            afinidad = parseFloat(((afinidad * 100) / cantidadAnimes).toFixed(2));
            return afinidad;
        });
    }
    afinidad(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = message.author.id;
            const serverID = message.guildId;
            const usuariosRegistrados = yield AniUser_1.AniUser.find({ serverId: serverID });
            const usuario = usuariosRegistrados.find(u => u.discordId == userID);
            const aniuser1 = yield this.usuario(usuario === null || usuario === void 0 ? void 0 : usuario.anilistUsername, "username");
            const userList1 = yield this.buscarLista(aniuser1 === null || aniuser1 === void 0 ? void 0 : aniuser1.getNombre());
            const user1AnimeList = userList1.data.animeList.lists[0].entries;
            let afinidades = [];
            let i = 0;
            while (i < usuariosRegistrados.length) {
                if (usuariosRegistrados[i].anilistUsername == (usuario === null || usuario === void 0 ? void 0 : usuario.anilistUsername)) {
                    i++;
                    continue;
                }
                const aniuser2 = yield this.usuario(usuariosRegistrados[i].anilistUsername, "username");
                const userList2 = yield this.buscarLista(aniuser2 === null || aniuser2 === void 0 ? void 0 : aniuser2.getNombre());
                const user2AnimeList = userList2.data.animeList.lists[0].entries;
                const resultado = yield this.calcularAfinidad(user1AnimeList, user2AnimeList);
                afinidades.push({ username: aniuser2 === null || aniuser2 === void 0 ? void 0 : aniuser2.getNombre(), afinidad: resultado });
                i++;
            }
            afinidades = afinidades.sort((a, b) => {
                if (a.afinidad < b.afinidad) {
                    return 1;
                }
                if (a.afinidad > b.afinidad) {
                    return -1;
                }
                return 0;
            });
            let textoAfinidad = "";
            for (let i = 0; i < afinidades.length && i < 10; i++) {
                textoAfinidad += `▹ ${afinidades[i].username} - **${afinidades[i].afinidad}%**\n`;
            }
            const hexColor = toHex.get(aniuser1 == null ? "black" : aniuser1.getColorName()).value;
            const color = "0x" + hexColor;
            const EmbedAfinidad = new discord_js_1.EmbedBuilder()
                .setTitle("Afinidad de " + (aniuser1 === null || aniuser1 === void 0 ? void 0 : aniuser1.getNombre()))
                .setThumbnail(aniuser1 == null ? null : aniuser1.getAvatarURL())
                .setDescription(textoAfinidad)
                .setColor(color);
            this.enviarEmbed(message, EmbedAfinidad);
            return true;
        });
    }
}
exports.BOT = BOT;
