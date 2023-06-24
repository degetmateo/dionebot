import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import BOT from "../bot";
import { Setup } from "../modulos/Setup";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unsetup")
        .setDescription("Te elimina de los usuarios registrados."),

    execute: async (interaction: ChatInputCommandInteraction) => {
        const bot = interaction.client as BOT;
        
        await interaction.deferReply({ ephemeral: true });

        const serverID = interaction.guild?.id != null ? interaction.guild.id : "";
        const userID = interaction.user.id;

        try {
            await Setup.UnsetupUsuario(serverID, userID);
        } catch (err) {
            console.error(err);

            return interaction.editReply({
                content: "Ha ocurrido un error.",
            })
        }

        bot.eliminarUsuario(serverID, userID);

        return interaction.editReply({
            content: "Listo!",
        })
    }
}