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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embeds = void 0;
const discord_js_1 = require("discord.js");
const toHex = __importStar(require("colornames"));
const Usuarios_1 = require("./Usuarios");
class Embeds {
    static EmbedImagen(url) {
        return new discord_js_1.EmbedBuilder()
            .setImage(url)
            .setFooter({ text: "..." });
    }
    static async EmbedInformacionMedia(interaction, obra, traducir) {
        var _a;
        const titulos = obra.getTitulos();
        const EmbedInformacion = new discord_js_1.EmbedBuilder()
            .setTitle(titulos.romaji == null ? titulos.native : titulos.romaji)
            .setURL(obra.getURL())
            .setDescription(traducir == true ? await obra.getDescripcionTraducida() : obra.getDescripcion())
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
        const uMedia = await Usuarios_1.Usuarios.GetUsuariosMedia((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id, obra);
        if (uMedia.length > 0) {
            let completedTEXT = "";
            let inProgressTEXT = "";
            let droppedTEXT = "";
            let pausedListTEXT = "";
            let planningTEXT = "";
            for (let i = 0; i < uMedia.length; i++) {
                if (uMedia[i].status == "COMPLETED") {
                    let repeat = uMedia[i].repeat;
                    if (repeat >= 1) {
                        completedTEXT += `${uMedia[i].name} **[${uMedia[i].score}]** **[x${uMedia[i].repeat}]** - `;
                    }
                    else {
                        completedTEXT += `${uMedia[i].name} **[${uMedia[i].score}]** - `;
                    }
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
            if (completedTEXT.trim().length > 0) {
                EmbedInformacion
                    .addFields({ name: "▿ Completado por", value: completedTEXT, inline: false });
            }
            if (inProgressTEXT.trim().length > 0) {
                EmbedInformacion
                    .addFields({ name: "▿ Iniciado por", value: inProgressTEXT, inline: false });
            }
            if (pausedListTEXT.trim().length > 0) {
                EmbedInformacion
                    .addFields({ name: "▿ Pausado por", value: pausedListTEXT, inline: false });
            }
            if (planningTEXT.trim().length > 0) {
                EmbedInformacion
                    .addFields({ name: "▿ Planeado por", value: planningTEXT, inline: false });
            }
            if (droppedTEXT.trim().length > 0) {
                EmbedInformacion
                    .addFields({ name: "▿ Dropeado por", value: droppedTEXT, inline: false });
            }
        }
        return EmbedInformacion;
    }
    static EmbedAfinidad(usuario, afinidades) {
        let textoAfinidad = "";
        for (let i = 0; i < afinidades.length && i < 10; i++) {
            textoAfinidad += `▸ ${afinidades[i].username} - **${afinidades[i].afinidad}%**\n`;
        }
        const hexColor = toHex.get(usuario == null ? "black" : usuario.getColorName()).value;
        const color = "0x" + hexColor;
        return new discord_js_1.EmbedBuilder()
            .setTitle("Afinidad de " + usuario.getNombre())
            .setThumbnail(usuario.getAvatarURL())
            .setDescription(textoAfinidad.length >= 1 ? textoAfinidad : "No hay afinidades disponibles.")
            .setColor(color);
    }
}
exports.Embeds = Embeds;
