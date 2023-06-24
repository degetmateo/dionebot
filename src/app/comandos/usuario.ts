import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Embeds } from "../modulos/Embeds";
import { Usuarios } from "../modulos/Usuarios";
import { UsuarioAnilist } from "../objetos/UsuarioAnilist";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("usuario")
        .setDescription("Devuelve la información de ANILIST de un usuario.")
        .addUserOption(option => 
            option
                .setName("usuario")
                .setDescription("El usuario del que se solicita la información.")),

    execute: async (interaction: ChatInputCommandInteraction) => {
        const userInteraction = interaction.options.getUser("usuario");
        const serverID = interaction.guild?.id;

        if (!serverID) {
            return interaction.reply({
                content: "Ha ocurrido un error.",
                ephemeral: true
            })
        }

        await interaction.deferReply();

        let usuario: any;

        if (!userInteraction) {
            usuario = await Usuarios.BuscarUsuario(serverID, interaction.user.id);
        } else {
            usuario = await Usuarios.BuscarUsuario(serverID, userInteraction.id);
        }

        if (!usuario) {
            return interaction.editReply({
                content: "No se ha encontrado al usuario.",
            })
        }

        usuario = new UsuarioAnilist(usuario);
        const embed = Embeds.EmbedInformacionUsuario(usuario);

        return interaction.editReply({
            embeds: [embed]
        })
    }
}