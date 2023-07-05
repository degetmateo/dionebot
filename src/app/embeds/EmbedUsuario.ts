import toHex from 'colornames';
import { ColorResolvable, EmbedBuilder } from "discord.js";
import { UsuarioAnilist } from "../objetos/UsuarioAnilist";

export default class EmbedUsuario extends EmbedBuilder {
    private constructor() {
        super();
    }

    public static Crear(usuario: UsuarioAnilist): EmbedUsuario {
        const hexColor = toHex.get(usuario.getColorName()).value;
        const stats = usuario.getEstadisticas();
        
        const embed = new EmbedBuilder()
            .setTitle(usuario.getNombre())
            .setURL(usuario.getURL())
            .setColor(hexColor as ColorResolvable)
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
            );

        return embed;
    }
}