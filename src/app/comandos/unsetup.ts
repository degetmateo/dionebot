import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import BOT from "../bot";
import { Setup } from "../modulos/Setup";
import Embed from "../embeds/Embed";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unsetup")
        .setDescription("Te elimina de los usuarios registrados."),

    execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
        await interaction.deferReply({ ephemeral: true });

        const bot = interaction.client as BOT;

        const serverID = interaction.guild?.id != null ? interaction.guild.id : "";
        const userID = interaction.user.id;

        await Setup.UnsetupUsuario(serverID, userID);

        bot.eliminarUsuario(serverID, userID);

        interaction.editReply({
            embeds: [Embed.CrearVerde('Listo! Se ha eliminado tu cuenta.')]
        })
    }
}