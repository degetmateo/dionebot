import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import BOT from "../bot";
import { Afinidad } from "../modulos/Afinidad";
import { Usuarios } from "../modulos/Usuarios";
import { UsuarioAnilist } from "../objetos/UsuarioAnilist";
import { Embeds } from "../modulos/Embeds";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("afinidad")
        .setDescription("Calcula la afinidad entre vos (u otro usuario) y los demás miembros registrados del servidor.")
        .addUserOption(option => 
            option
                .setName("usuario")
                .setDescription("Usuario del que quieres calcular la afinidad.")),

    execute: async (interaction: ChatInputCommandInteraction) => {
        const bot = interaction.client as BOT;

        return interaction.reply({
            content: 'Comando actualmente en mantenimiento.',
            ephemeral: true
        })

        /*const serverID = interaction.guild?.id;

        if (!serverID) {
            return interaction.reply({
                content: "Ha ocurrido un error.",
                ephemeral: true
            })
        }

        if (bot.isGettingAfinitty(serverID)) {
            return interaction.reply({
                content: "Se está calculando la afinidad de alguien más en este momento.",
                ephemeral: true
            })
        }

        const usuario = interaction.options.getUser("usuario");
        const usuarioID = usuario == null ? interaction.user.id : usuario.id;

        const usuariosRegistrados = bot.getUsuariosRegistrados(serverID);
        const usuarioRegistrado = usuariosRegistrados.find(u => u.discordId === usuarioID);

        if (!usuarioRegistrado) {
            return interaction.reply({
                content: "Tu o el usuario mencionado no está registrado.",
                ephemeral: true
            })
        }

        bot.setGettingAffinity(serverID, true);
        await interaction.deferReply();

        let usuarioAnilist = await Usuarios.BuscarUsuario(serverID, usuarioRegistrado.anilistUsername);

        if (!usuarioAnilist) {
            bot.setGettingAffinity(serverID, false);

            return interaction.editReply({
                content: `No se ha encontrado al usuario **${usuarioRegistrado.anilistUsername}** en anilist. Puede que se haya cambiado el nombre.`
            })
        }

        usuarioAnilist = new UsuarioAnilist(usuarioAnilist);

        try {
            const afinidades = await Afinidad.GetAfinidadUsuario(usuarioAnilist, usuariosRegistrados);
            const EmbedInformacionAfinidad = Embeds.EmbedAfinidad(usuarioAnilist, afinidades);

            bot.setGettingAffinity(serverID, false);

            return interaction.editReply({
                embeds: [EmbedInformacionAfinidad]
            })
        } catch (error) {
            console.error(error);

            bot.setGettingAffinity(serverID, false);

            return interaction.editReply({
                content: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."
            })
        }*/
    }
}