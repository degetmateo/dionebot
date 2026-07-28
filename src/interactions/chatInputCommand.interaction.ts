import { MessageFlags } from "discord.js";
import GenericError from "../errors/genericError";
import ErrorEmbed from "../embeds/errorEmbed";
import cooldownsHelper from "../helpers/cooldowns.helper";
import responsesHelper from "../helpers/responses.helper";
import GuildChatInputCommandInteraction from "../extensions/guildChatInputCommandInteraction.extension";
import Bot from "../extensions/bot.extension";

export default {
    execute: async (interaction: GuildChatInputCommandInteraction) => {
        try {
            const bot = interaction.client as Bot;
            const command = bot.commands.get(interaction.commandName);
            
            if (!command) {
                console.error(`🟥 | No command matching ${interaction.commandName} was found.`);
                throw new GenericError();
            };

            if (bot.settings.maintenance) {
                if (command.data.name != 'eval'){
                    throw new GenericError('¡Estoy en mantenimiento! Inténtalo de nuevo más tarde.');
                };
            };

            cooldownsHelper.execute(interaction);
            await command.execute(interaction);
        } catch (error: any) {
            console.error(error);
            if (error instanceof GenericError) {
                await responsesHelper.execute(interaction, [new ErrorEmbed(error.message)], { flags: [MessageFlags.Ephemeral] });
            } else {
                await responsesHelper.execute(interaction, [new ErrorEmbed('Ha ocurrido un error inesperado.')], { flags: [MessageFlags.Ephemeral] });
            };
        }
    }
};