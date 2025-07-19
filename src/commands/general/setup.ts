import { ChatInputCommandInteraction, InteractionContextType, SlashCommandBuilder } from "discord.js";
import SetupCommandInteraction from "../../interactions/setup/setupCommandInteraction";
import GenericError from "../../errors/genericError";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sign in with your Anilist account.')
        .setDescriptionLocalization('es-ES', 'Inicia sesión con tu cuenta de Anilist.')
        .setDescriptionLocalization('es-419', 'Inicia sesión con tu cuenta de Anilist.')
        .setNSFW(false)
        .setContexts(InteractionContextType.Guild),
    execute: async (interaction: ChatInputCommandInteraction) => {
        try {
            await new SetupCommandInteraction(interaction).execute();
        } catch (error) {
            console.error(error);
            if (error instanceof GenericError) throw error;
            else throw new GenericError();
        };
    }
};