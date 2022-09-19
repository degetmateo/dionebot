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
const AniUser_1 = require("../models/AniUser");
const Mensaje_1 = require("./Mensaje");
const BuscarUsuario_1 = require("../modulos/BuscarUsuario");
const BuscarMediaNombre_1 = require("../modulos/BuscarMediaNombre");
const GetDatosMedia_1 = require("../modulos/GetDatosMedia");
const BuscarMediaUsuario_1 = require("../modulos/BuscarMediaUsuario");
const BuscarListaUsuario_1 = require("../modulos/BuscarListaUsuario");
const GetUsuariosMedia_1 = require("../modulos/GetUsuariosMedia");
const SetupUsuario_1 = require("../modulos/SetupUsuario");
const UnsetupUsuario_1 = require("../modulos/UnsetupUsuario");
const GetAfinidadUsuario_1 = require("../modulos/GetAfinidadUsuario");
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
                const anime = yield this.anime(args.join(" "));
                if (!anime) {
                    return message.react("❌");
                }
                else {
                    message.react("✅");
                }
                const embedInformacion = yield this.EmbedInformacionMedia(message, anime);
                this.enviarEmbed(message, embedInformacion);
            }
            if (comando == "!manga") {
                const manga = yield this.manga(args.join(" "));
                if (!manga) {
                    return message.react("❌");
                }
                else {
                    message.react("✅");
                }
                const embedInformacion = yield this.EmbedInformacionMedia(message, manga);
                this.enviarEmbed(message, embedInformacion);
            }
            if (comando == "!user") {
                let usuario;
                if (!args[0] || args[0].length <= 0) {
                    usuario = yield this.usuario(message.author.id);
                }
                else {
                    usuario = yield this.usuario(args[0]);
                }
                if (!usuario) {
                    return message.react("❌");
                }
                else {
                    message.react("✅");
                }
                const embedInformacion = yield this.EmbedInformacionUsuario(usuario);
                this.enviarEmbed(message, embedInformacion);
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
    EmbedInformacionMedia(message, obra) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const titulos = obra.getTitulos();
            const EmbedInformacion = new discord_js_1.EmbedBuilder()
                .setTitle(titulos.romaji == null ? titulos.native : titulos.romaji)
                .setURL(obra.getURL())
                .setDescription(obra.getDescripcion())
                .setThumbnail(obra.getCoverImageURL())
                .setFooter({ text: obra.getTitulos().native + " | " + obra.getTitulos().english });
            if (obra.getTipo() == "ANIME") {
                const infoTEXT_1 = `
                ‣ **Tipo**: ${obra.getTipo()}\n‣ **Formato**: ${obra.getFormato()}\n‣ **Estado**: ${obra.getEstado()}\n‣ **Calificación**: ${obra.getPromedio()}/100
            `;
                const infoTEXT_2 = `
                ‣ **Popularidad**: ${obra.getPopularidad()}\n‣ **Favoritos**: ${obra.getFavoritos()}\n‣ **Temporada**: ${obra.getTemporada()}\n‣ **Año de Emisión**: ${obra.getAnioEmision()}\n‣ **Episodios**: ${obra.getEpisodios()}
            `;
                EmbedInformacion
                    .setColor(0xff0000)
                    .addFields({ name: "▽", value: infoTEXT_1, inline: true }, { name: "▽", value: infoTEXT_2, inline: true });
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
                    .addFields({ name: "▽", value: infoTEXT_1, inline: true }, { name: "▽", value: infoTEXT_2, inline: true });
            }
            let generosInfo = "";
            const generos = obra.getGeneros();
            for (let i = 0; i < generos.length; i++) {
                generosInfo += "`" + generos[i] + "` - ";
            }
            generosInfo = generosInfo.substring(0, generosInfo.length - 3);
            if (!generosInfo || generosInfo.length < 0)
                generosInfo = "`Desconocidos`";
            EmbedInformacion
                .addFields({ name: "▿ Géneros", value: generosInfo, inline: false });
            const uMedia = yield this.getUsuariosMedia((_a = message.guild) === null || _a === void 0 ? void 0 : _a.id, obra);
            if (uMedia.length > 0) {
                let completedTEXT = "";
                let inProgressTEXT = "";
                let droppedTEXT = "";
                let pausedListTEXT = "";
                let planningTEXT = "";
                for (let i = 0; i < uMedia.length; i++) {
                    if (uMedia[i].status == "COMPLETED") {
                        completedTEXT += `${uMedia[i].name} **[${uMedia[i].score}]** - `;
                    }
                    if (uMedia[i].status == "DROPPED") {
                        droppedTEXT += `${uMedia[i].name} **(${uMedia[i].progress})** **[${uMedia[i].score}]** - `;
                    }
                    if (uMedia[i].status == "CURRENT") {
                        inProgressTEXT += `${uMedia[i].name} **(${uMedia[i].progress})** **[${uMedia[i].score}]** - `;
                    }
                    if (uMedia[i].status == "PAUSED") {
                        pausedListTEXT += `${uMedia[i].name} **[${uMedia[i].score}]** - `;
                    }
                    if (uMedia[i].status == "PLANNING") {
                        planningTEXT += `${uMedia[i].name} - `;
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
                    .addFields({ name: "▿ Completado por", value: completedTEXT, inline: false }, { name: "▿ Dropeado por", value: droppedTEXT, inline: false }, { name: "▿ Pausado por", value: pausedListTEXT, inline: false }, { name: "▿ Iniciado por", value: inProgressTEXT, inline: false }, { name: "▿ Planeado por", value: planningTEXT, inline: false });
            }
            return EmbedInformacion;
        });
    }
    anime(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.buscarMedia("ANIME", args);
        });
    }
    manga(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.buscarMedia("MANGA", args);
        });
    }
    buscarMedia(tipo, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(parseInt(args))) {
                const mediaID = yield (0, BuscarMediaNombre_1.BuscarMediaNombre)(this, tipo, args);
                const media = yield (0, GetDatosMedia_1.GetDatosMedia)(this, tipo, mediaID);
                return new Obra_1.Obra(media);
            }
            else {
                const media = yield (0, GetDatosMedia_1.GetDatosMedia)(this, tipo, args);
                return new Obra_1.Obra(media);
            }
        });
    }
    getUsuariosMedia(serverID, media) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, GetUsuariosMedia_1.GetUsuariosMedia)(this, serverID, media);
        });
    }
    request(query, variables) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = 'https://graphql.anilist.co';
            const opciones = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query, variables })
            };
            const data = yield (0, node_fetch_1.default)(url, opciones);
            const response = yield data.json();
            if (!response || !response.data)
                return null;
            return response.data;
        });
    }
    buscarMediaUsuario(userID, mediaID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, BuscarMediaUsuario_1.BuscarMediaUsuario)(this, userID, mediaID);
        });
    }
    buscarListaUsuario(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, BuscarListaUsuario_1.BuscarListaUsuario)(this, username);
        });
    }
    usuario(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, BuscarUsuario_1.BuscarUsuario)(this, args);
            return user == null ? null : new Usuario_1.Usuario(user);
        });
    }
    EmbedInformacionUsuario(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const hexColor = toHex.get(usuario.getColorName()).value;
            const color = "0x" + hexColor;
            const stats = usuario.getEstadisticas();
            const EmbedInformacion = new discord_js_1.EmbedBuilder()
                .setTitle(usuario.getNombre())
                .setURL(usuario.getURL())
                .setColor(color)
                .setThumbnail(usuario.getAvatarURL())
                .setImage(usuario.getBannerImage())
                .setDescription(usuario.getBio())
                .addFields({
                name: "Animes",
                value: `‣ Vistos: ${stats.anime.count}\n‣ Nota Promedio: ${stats.anime.meanScore}\n‣ Días Vistos: ${((stats.anime.minutesWatched / 60) / 24).toFixed()}\n‣ Episodios Totales: ${stats.anime.episodesWatched}`,
                inline: false
            }, {
                name: "Mangas",
                value: `‣ Leídos: ${stats.manga.count}\n‣ Nota Promedio: ${stats.manga.meanScore}\n‣ Capítulos Leídos: ${stats.manga.chaptersRead}\n‣ Volúmenes Leídos: ${stats.manga.volumesRead}`,
                inline: false
            });
            return EmbedInformacion;
        });
    }
    setup(username, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, SetupUsuario_1.SetupUsuario)(this, username, message);
        });
    }
    unsetup(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, UnsetupUsuario_1.UnsetupUsuario)(this, message);
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
            afinidad = parseFloat(((afinidad * 100) / cantidadAnimes).toFixed(2));
            return afinidad;
        });
    }
    getAfinidadUsuario(userID, serverID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, GetAfinidadUsuario_1.GetAfinidadUsuario)(this, userID, serverID);
        });
    }
    ordenarAfinidades(afinidades) {
        return afinidades.sort((a, b) => {
            if (a.afinidad < b.afinidad) {
                return 1;
            }
            if (a.afinidad > b.afinidad) {
                return -1;
            }
            return 0;
        });
    }
    afinidad(message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const uRegistrados = yield AniUser_1.AniUser.find({ serverId: (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id });
            const usuario = uRegistrados.find(u => u.discordId == message.author.id);
            if (!usuario)
                return false;
            message.channel.sendTyping();
            const aniuser1 = yield this.usuario((usuario === null || usuario === void 0 ? void 0 : usuario.anilistUsername) || "");
            let afinidades = this.ordenarAfinidades(yield this.getAfinidadUsuario(aniuser1, uRegistrados));
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
