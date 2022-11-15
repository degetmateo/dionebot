import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Setup } from "../modulos/Setup";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unsetup")
        .setDescription("Te elimina de los usuarios registrados."),

    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ ephemeral: true });

        const serverID = interaction.guild?.id != null ? interaction.guild.id : "";
        const userID = interaction.user.id;
        const resultado = await Setup.UnsetupUsuario(serverID, userID);

        if (!resultado) {
            return interaction.editReply({
                content: "Ha ocurrido un error.",
            })
        }

        return interaction.editReply({
            content: "Listo!",
        })
    }
}