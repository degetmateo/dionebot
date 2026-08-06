import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import responsesHelper from "../helpers/responses.helper";
import ErrorEmbed from "../embeds/errorEmbed";
import Bot from "../extensions/bot.extension";
import GenericError from "../errors/genericError";

export default {
    execute: async (interaction: ModalSubmitInteraction) => {
        try {
            const bot = interaction.client as Bot;
            
            if (bot.settings.maintenance) {
                throw new GenericError('¡Estoy en mantenimiento! Inténtalo de nuevo más tarde.');
            };

            const args = interaction.customId.split('_');

            const id = args[0];
            
            const modal = bot.modals.get(id);
            
            const cache = args[1];
            const data = cache ? bot.get(cache) : null;
            
            if (modal) {
                return await modal.execute(interaction, data);
            };
        } catch (error: any) {
            console.error(error);
            if (error instanceof GenericError) {
                await responsesHelper.execute(interaction, [new ErrorEmbed(error.message)], { flags: [MessageFlags.Ephemeral] });
            } else {
                await responsesHelper.execute(interaction, [new ErrorEmbed('Ha ocurrido un error inesperado.')], { flags: [MessageFlags.Ephemeral] });
            };             
        };
    }
};