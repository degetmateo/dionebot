import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Setup } from "../modulos/Setup";


module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Registra tu usuario de ANILIST en este servidor.")
        .addStringOption(option => 
            option
                .setName("username")
                .setDescription("Tu nombre de usuario de ANILIST.")
                .setRequired(true)),

    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ ephemeral: true });
        
        const username = interaction.options.getString("username");

        if (!username) {
            return interaction.editReply({
                content: "Ha ocurrido un error.",
            })
        }

        const serverID = interaction.guild?.id  != null ? interaction.guild?.id : "";
        const userID = interaction.user.id;
        const resultado = await Setup.SetupUsuario(username, serverID, userID);

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