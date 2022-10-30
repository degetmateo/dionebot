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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embeds = void 0;
const discord_js_1 = require("discord.js");
const toHex = __importStar(require("colornames"));
const Usuarios_1 = require("./Usuarios");
class Embeds {
    static EmbedInformacionUsuario(usuario) {
        const hexColor = toHex.get(usuario.getColorName()).value;
        const color = "0x" + hexColor;
        const stats = usuario.getEstadisticas();
        return new discord_js_1.EmbedBuilder()
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
    }
    static EmbedInformacionHelp() {
        const descripcion = "▹ `!setup [anilist username]` - Guardar tu usuario de anilist para mostrar tus notas.\n▹ `!unsetup` - Elimina tu usuario de anilist.\n▹ `!user | [anilist username] | [discord mention]` - Ver la información del perfil de anilist de un usuario.\n▹ `!afinidad | [anilist username] | [discord mention]` - Muestra tu afinidad o la otro usuario con el resto del servidor.\n▹ `!manga o !anime [nombre] | [id]` - Muestra la información de un anime o manga.\n▹ `!mangab o !animeb [nombre] | [id]` - Lo mismo pero con la descripción traducida.\n▹ `!color [HEX CODE]` - Te da un rol con el color del código hexadecimal que pongas.";
        return new discord_js_1.EmbedBuilder()
            .setTitle("▾ Comandos")
            .setDescription(descripcion.trim());
    }
    static EmbedInformacionMedia(message, obra, traducir) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const titulos = obra.getTitulos();
            const EmbedInformacion = new discord_js_1.EmbedBuilder()
                .setTitle(titulos.romaji == null ? titulos.native : titulos.romaji)
                .setURL(obra.getURL())
                .setDescription(traducir == true ? yield obra.getDescripcionTraducida() : obra.getDescripcion())
                .setThumbnail(obra.getCoverImageURL())
                .setFooter({ text: obra.getTitulos().native + " | " + obra.getTitulos().english })
                .setColor(obra.getColorEstado());
            if (obra.getTipo() == "ANIME") {
                const infoTEXT_1 = `
                ‣ **Tipo**: ${obra.getTipo()}\n‣ **Formato**: ${obra.getFormato()}\n‣ **Estado**: ${obra.getEstado()}\n‣ **Calificación**: ${obra.getPromedio()}/100
            `;
                const infoTEXT_2 = `
                ‣ **Popularidad**: ${obra.getPopularidad()}\n‣ **Favoritos**: ${obra.getFavoritos()}\n‣ **Temporada**: ${obra.getTemporada()}\n‣ **Año de Emisión**: ${obra.getAnioEmision()}\n‣ **Episodios**: ${obra.getEpisodios()}
            `;
                EmbedInformacion
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
                    .addFields({ name: "▽", value: infoTEXT_1, inline: true }, { name: "▽", value: infoTEXT_2, inline: true });
            }
            let estudiosInfo = "";
            const estudios = obra.getEstudios();
            for (let i = 0; i < estudios.length; i++) {
                estudiosInfo += "`" + estudios[i].name + "` - ";
            }
            estudiosInfo = estudiosInfo.substring(0, estudiosInfo.length - 3);
            if (!estudiosInfo || estudiosInfo.length < 0)
                estudiosInfo = "`Desconocidos`";
            if (obra.getTipo() == "ANIME") {
                EmbedInformacion
                    .addFields({ name: "▿ Estudios", value: estudiosInfo, inline: false });
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
            const uMedia = yield Usuarios_1.Usuarios.GetUsuariosMedia((_a = message.guild) === null || _a === void 0 ? void 0 : _a.id, obra);
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
                        pausedListTEXT += `${uMedia[i].name} **(${uMedia[i].progress})** **[${uMedia[i].score}]** - `;
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
    static EmbedAfinidad(usuario, afinidades) {
        let textoAfinidad = "";
        for (let i = 0; i < afinidades.length && i < 10; i++) {
            textoAfinidad += `▹ ${afinidades[i].username} - **${afinidades[i].afinidad}%**\n`;
        }
        const hexColor = toHex.get(usuario == null ? "black" : usuario.getColorName()).value;
        const color = "0x" + hexColor;
        return new discord_js_1.EmbedBuilder()
            .setTitle("Afinidad de " + usuario.getNombre())
            .setThumbnail(usuario.getAvatarURL())
            .setDescription(textoAfinidad)
            .setColor(color);
    }
}
exports.Embeds = Embeds;
