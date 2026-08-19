import { Events, Interaction, MessageFlags } from 'discord.js';
import Bot from '../bot/bot';
import GenericError from '../errors/genericError';
import cooldownsHelper from '../helpers/cooldowns.helper';
import responsesHelper from '../helpers/responses.helper';
import ErrorEmbed from '../embeds/errorEmbed';

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction: Interaction) => {
        try {
            const bot = interaction.client as Bot;

            if (!interaction.inGuild()) return;

            if (interaction.isChatInputCommand()) {
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
                return await command.execute(interaction);
            };

            if (bot.settings.maintenance) {
                throw new GenericError('¡Estoy en mantenimiento! Inténtalo de nuevo más tarde.');
            };

            if (interaction.isButton() || interaction.isModalSubmit()) {
                const args = interaction.customId.split('_');
                const componentId = args[0];
                const cacheId = args[1];
                const data = cacheId ? bot.get(cacheId) : null;

                if (interaction.isButton()) {
                    const button = bot.buttons.get(componentId);

                    if (button) {
                        return await button.execute(interaction, data);
                    };
                };

                if (interaction.isModalSubmit()) {
                    const modal = bot.modals.get(componentId);
                    
                    if (modal) {
                        return await modal.execute(interaction, data);
                    };
                };
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