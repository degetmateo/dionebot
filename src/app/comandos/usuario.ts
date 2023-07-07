import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Usuarios } from "../modulos/Usuarios";
import { UsuarioAnilist } from "../objetos/UsuarioAnilist";
import SinResultadosError from "../errores/ErrorSinResultados";
import EmbedUsuario from "../embeds/EmbedUsuario";
import Aniuser from "../modelos/Aniuser";
import ErrorSinResultados from "../errores/ErrorSinResultados";
import Usuario from "../apis/anilist/Usuario";
import AnilistAPI from "../apis/AnilistAPI";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("usuario")
        .setDescription("Muestra la información del perfil de Anilist de un usuario.")
        .addUserOption(option => 
            option
                .setName("usuario")
                .setDescription("El usuario del que se solicita la información.")),

    execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
        await interaction.deferReply();

        const idUsuario = interaction.options.getUser("usuario")?.id || interaction.user.id;
        const idServidor = interaction.guild?.id as string;

        const usuarioRegistrado = await Aniuser.findOne({ serverId: idServidor, discordId: idUsuario });
        if (!usuarioRegistrado) throw new ErrorSinResultados('El usuario especificado no esta registrado.');

        const usuarioAnilist: Usuario = await AnilistAPI.obtenerUsuario(parseInt(usuarioRegistrado.anilistId as string));  

        interaction.editReply({
            embeds: [EmbedUsuario.Crear(usuarioAnilist)]
        })
    }
}