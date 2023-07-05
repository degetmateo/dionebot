import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Usuarios } from "../modulos/Usuarios";
import { UsuarioAnilist } from "../objetos/UsuarioAnilist";
import SinResultadosError from "../errores/ErrorSinResultados";
import EmbedUsuario from "../embeds/EmbedUsuario";

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

        const usuario = interaction.options.getUser("usuario");
        const idServidor = interaction.guild?.id as string;

        let usuarioAnilist: UsuarioAnilist;

        if (!usuario) {
            usuarioAnilist = new UsuarioAnilist(await Usuarios.BuscarUsuario(idServidor, interaction.user.id));
            if (!usuarioAnilist.getData()) throw new SinResultadosError('No se ha encontrado tu usuario.');
        } else {
            usuarioAnilist = new UsuarioAnilist(await Usuarios.BuscarUsuario(idServidor, usuario.id));
            if (!usuarioAnilist.getData()) throw new SinResultadosError('No se ha encontrado al usuario.');
        }        

        interaction.editReply({
            embeds: [EmbedUsuario.Crear(usuarioAnilist)]
        })
    }
}