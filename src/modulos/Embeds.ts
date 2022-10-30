import { EmbedBuilder, ColorResolvable, Embed, Message } from "discord.js";
import * as toHex from "colornames";
import { Usuario } from "../modelos/Usuario";
import { Obra } from "../modelos/Obra";
import { Usuarios } from "./Usuarios";

class Embeds {
    public static EmbedInformacionUsuario(usuario: Usuario): EmbedBuilder {
        const hexColor = toHex.get(usuario.getColorName()).value;
        const color = "0x" + hexColor;

        const stats = usuario.getEstadisticas();

        return new EmbedBuilder()
            .setTitle(usuario.getNombre())
            .setURL(usuario.getURL())
            .setColor(color as ColorResolvable)
            .setThumbnail(usuario.getAvatarURL())
            .setImage(usuario.getBannerImage())
            .setDescription(usuario.getBio())
            .addFields(
                { 
                    name: "Animes",
                    value: `‣ Vistos: ${stats.anime.count}\n‣ Nota Promedio: ${stats.anime.meanScore}\n‣ Días Vistos: ${((stats.anime.minutesWatched / 60) / 24).toFixed()}\n‣ Episodios Totales: ${stats.anime.episodesWatched}`,
                    inline: false
                },
                { 
                    name: "Mangas",
                    value: `‣ Leídos: ${stats.manga.count}\n‣ Nota Promedio: ${stats.manga.meanScore}\n‣ Capítulos Leídos: ${stats.manga.chaptersRead}\n‣ Volúmenes Leídos: ${stats.manga.volumesRead}`,
                    inline: false
                },
            )
    }

    public static EmbedInformacionHelp(): EmbedBuilder {
        const descripcion = "▹ `!setup [anilist username]` - Guardar tu usuario de anilist para mostrar tus notas.\n▹ `!unsetup` - Elimina tu usuario de anilist.\n▹ `!user | [anilist username] | [discord mention]` - Ver la información del perfil de anilist de un usuario.\n▹ `!afinidad | [anilist username] | [discord mention]` - Muestra tu afinidad o la otro usuario con el resto del servidor.\n▹ `!manga o !anime [nombre] | [id]` - Muestra la información de un anime o manga.\n▹ `!mangab o !animeb [nombre] | [id]` - Lo mismo pero con la descripción traducida.\n▹ `!color [HEX CODE]` - Te da un rol con el color del código hexadecimal que pongas.";
                
        return new EmbedBuilder()
            .setTitle("▾ Comandos")
            .setDescription(descripcion.trim());
    }

    public static async EmbedInformacionMedia(message: Message, obra: Obra, traducir: boolean): Promise<EmbedBuilder> {
        const titulos = obra.getTitulos();

        const EmbedInformacion = new EmbedBuilder()
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
                .addFields(
                    { name: "▽", value: infoTEXT_1, inline: true },
                    { name: "▽", value: infoTEXT_2, inline: true }
                )
        } else {
            const infoTEXT_1 = `
                ‣ **Tipo**: ${obra.getTipo()}\n‣ **Formato**: ${obra.getFormato()}\n‣ **Estado**: ${obra.getEstado()}\n‣ **Calificación**: ${obra.getPromedio()}/100
            `;

            const infoTEXT_2 = `
                ‣ **Popularidad**: ${obra.getPopularidad()}\n‣ **Favoritos**: ${obra.getFavoritos()}\n‣ **Capítulos**: ${obra.getCapitulos()}\n‣ **Volúmenes**: ${obra.getVolumenes()}
            `;

            EmbedInformacion
                .addFields(
                    { name: "▽", value: infoTEXT_1, inline: true },
                    { name: "▽", value: infoTEXT_2, inline: true }
                )
        }

        let estudiosInfo = "";

        const estudios = obra.getEstudios();

        for (let i = 0; i < estudios.length; i++) {
            estudiosInfo += "`" + estudios[i].name + "` - ";
        }

        estudiosInfo = estudiosInfo.substring(0, estudiosInfo.length - 3);

        if (!estudiosInfo || estudiosInfo.length < 0) estudiosInfo = "`Desconocidos`";

        if (obra.getTipo() == "ANIME") {
            EmbedInformacion
                .addFields(
                    { name: "▿ Estudios", value: estudiosInfo, inline: false }
                )
        }

        let generosInfo = "";

        const generos = obra.getGeneros();

        for (let i = 0; i < generos.length; i++) {
            generosInfo += "`" + generos[i] + "` - "
        }

        generosInfo = generosInfo.substring(0, generosInfo.length - 3);

        if (!generosInfo || generosInfo.length < 0) generosInfo = "`Desconocidos`"

        EmbedInformacion
            .addFields(
                { name: "▿ Géneros", value: generosInfo, inline: false }
            );


        const uMedia = await Usuarios.GetUsuariosMedia(message.guild?.id, obra);

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

    public static EmbedAfinidad(usuario: Usuario, afinidades: Array<{ username: string, afinidad: number }>): EmbedBuilder {
        let textoAfinidad = "";

        for (let i = 0; i < afinidades.length && i < 10; i++) {
            textoAfinidad += `▹ ${afinidades[i].username} - **${afinidades[i].afinidad}%**\n`;
        }

        const hexColor = toHex.get(usuario == null ? "black" : usuario.getColorName()).value;
        const color = "0x" + hexColor;

        return new EmbedBuilder()
            .setTitle("Afinidad de " + usuario.getNombre())
            .setThumbnail(usuario.getAvatarURL())
            .setDescription(textoAfinidad)
            .setColor(color as ColorResolvable)
    }
}

export { Embeds };