import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ColorResolvable } from "discord.js";
import toHex from 'colornames';
import { Usuarios } from "../modulos/Usuarios";
import { UsuarioAnilist } from "../objetos/UsuarioAnilist";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("usuario")
        .setDescription("Muestra la información del perfil de Anilist de un usuario.")
        .addUserOption(option => 
            option
                .setName("usuario")
                .setDescription("El usuario del que se solicita la información.")),

    execute: async (interaction: ChatInputCommandInteraction) => {
        const usuario = interaction.options.getUser("usuario");
        const idServidor = interaction.guild?.id;

        if (!idServidor) {
            throw new Error('No se ha podido obtener la ID del servidor.');
        }

        await interaction.deferReply();

        let usuarioAnilist: UsuarioAnilist;

        if (!usuario) {
            usuarioAnilist = new UsuarioAnilist(await Usuarios.BuscarUsuario(idServidor, interaction.user.id));
        } else {
            usuarioAnilist = new UsuarioAnilist(await Usuarios.BuscarUsuario(idServidor, usuario.id));
        }

        if (!usuarioAnilist.getData()) {
            return interaction.editReply({
                content: "No se ha encontrado al usuario.",
            })
        }

        const hexColor = toHex.get(usuarioAnilist.getColorName()).value;
        const stats = usuarioAnilist.getEstadisticas();
        
        const embed = new EmbedBuilder()
            .setTitle(usuarioAnilist.getNombre())
            .setURL(usuarioAnilist.getURL())
            .setColor(hexColor as ColorResolvable)
            .setThumbnail(usuarioAnilist.getAvatarURL())
            .setImage(usuarioAnilist.getBannerImage())
            .setDescription(usuarioAnilist.getBio())
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

        return interaction.editReply({
            embeds: [embed]
        })
    }
}