import { ChatInputCommandInteraction, Embed, SlashCommandBuilder } from "discord.js";
import BOT from "../bot";
import Aniuser from "../modelos/Aniuser";
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

    execute: async (interaction: ChatInputCommandInteraction, bot: BOT) => {
        await interaction.deferReply();

        const serverID = interaction.guild?.id != null ? interaction.guild.id : "";
        const usuario = interaction.options.getUser("usuario");

        // if (bot.estaBuscandoAfinidad(serverID)) {
        //     return interaction.editReply({
        //         content: "Ya se está calculando la afinidad de alguien más en este momento.",
        //         options: { ephemeral: true }
        //     })
        // }

        bot.setBuscandoAfinidad(serverID, true);

        const userID = usuario == null ? interaction.user.id : usuario.id;

        const uRegistrados = await Aniuser.find({ serverId: serverID });
        const uRegistrado = uRegistrados.find(u => u.discordId == userID);

        if (!uRegistrado) {
            bot.setBuscandoAfinidad(serverID, false);

            return interaction.editReply({
                content: "El usuario no está registrado.",
            })
        }

        if (!uRegistrado.anilistUsername) {
            bot.setBuscandoAfinidad(serverID, false);

            console.error("[ERROR] Usuario registrado sin usuario de ANILIST.");

            return interaction.editReply({
                content: "Ha ocurrido un error.",      
            })
        }

        const aniuser1 = new Usuario(await Usuarios.BuscarUsuario(serverID, uRegistrado.anilistUsername));

        if (!aniuser1) {
            bot.setBuscandoAfinidad(serverID, false);

            return interaction.editReply({
                content: `No se ha encontrado al usuario **${uRegistrado.anilistUsername}** en ANILIST. Probablemente se haya cambiado el nombre.`,
            })
        }

        const resultado = await Afinidad.GetAfinidadUsuario(aniuser1, uRegistrados);

        if (resultado.error) {
            bot.setBuscandoAfinidad(serverID, false);

            return interaction.editReply({
                content: "Ha ocurrido un error al calcular la afinidad."
            })
        }

        const EmbedInformacionAfinidad = Embeds.EmbedAfinidad(aniuser1, resultado.afinidades);

        bot.setBuscandoAfinidad(serverID, false);

        return interaction.editReply({
            embeds: [EmbedInformacionAfinidad]
        })
    }
}