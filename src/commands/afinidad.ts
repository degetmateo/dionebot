import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import BOT from "../bot";
import { Afinidad } from "../modulos/Afinidad";
import { Embeds } from "../modulos/Embeds";
import { Usuarios } from "../modulos/Usuarios";
import { Usuario } from "../objetos/Usuario";

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
        
        const serverID = interaction.guild?.id != null ? interaction.guild.id : "";

        if (bot.isCalculatingAffinity(serverID)) {
            return interaction.reply({
                content: "Ya se está calculando la afinidad de alguien más en este momento.",
                ephemeral: true
            })
        }

        bot.setCalculatingAffinity(serverID, true);

        const usuario = interaction.options.getUser("usuario");
        const userID = usuario == null ? interaction.user.id : usuario.id;

        const uRegistrados = bot.getUsuariosRegistrados(serverID);
        const uRegistrado = uRegistrados.find(u => u.discordId === userID);

        if (!uRegistrado) {
            bot.setCalculatingAffinity(serverID, false);

            return interaction.reply({
                content: "El usuario no está registrado.",
                ephemeral: true
            })
        }

        await interaction.deferReply();

        const anilistUser = await Usuarios.BuscarUsuario(serverID, uRegistrado.anilistUsername);

        if (!anilistUser) {
            bot.setCalculatingAffinity(serverID, false);

            return interaction.editReply({
                content: `No se ha encontrado al usuario **${uRegistrado.anilistUsername}** en la base de datos de ANILIST. Probablemente se haya cambiado el nombre.`
            })
        }

        const aniuser1 = new Usuario(anilistUser);

        try {
            const afinidades = await Afinidad.GetAfinidadUsuario(aniuser1, uRegistrados);
            const EmbedInformacionAfinidad = Embeds.EmbedAfinidad(aniuser1, afinidades);

            bot.setCalculatingAffinity(serverID, false);

            return interaction.editReply({
                embeds: [EmbedInformacionAfinidad]
            })
        } catch (err) {
            const error = err as Error;

            console.error(error);

            bot.setCalculatingAffinity(serverID, false);

            return interaction.editReply({
                content: error.message
            })
        }
    }
}