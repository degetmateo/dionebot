import { ChatInputCommandInteraction, Collection, Events, MessageFlags } from 'discord.js';
import Bot from '../extensions/bot';
import ErrorEmbed from '../embeds/errorEmbed';
import cooldownMessages from '../static/cooldownMessages';
import GenericError from '../errors/genericError';

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction: ChatInputCommandInteraction) => {
        try {
            if (!interaction.isChatInputCommand()) return;

            const bot = interaction.client as Bot;
            const command = bot.commands.get(interaction.commandName);

            if (!command) {
                console.error(`🟥 | No command matching ${interaction.commandName} was found.`);
                throw new GenericError();
            };

            const cooldowns = bot.cooldowns;

            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            };

            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldown = 3;
            const cooldownAmount = (command.cooldown ?? defaultCooldown) * 1000;

            if (timestamps?.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const expirationSeconds = ((expirationTime - now) / 1000).toFixed(0);

                    return await interaction.reply({
                        embeds: [new ErrorEmbed(cooldownMessages(interaction.locale, expirationSeconds))],
                        flags: [MessageFlags.Ephemeral]
                    });
                };
            };

            timestamps?.set(interaction.user.id, now);
            setTimeout(() => timestamps?.delete(interaction.user.id), cooldownAmount);

            await command.execute(interaction);
        } catch (error: any) {
            console.error(error);

            try {
                if (interaction.replied || interaction.deferred) {
                    const response = await interaction.fetchReply();

                    await response.edit({ 
                        embeds: [new ErrorEmbed(error.message)]
                    });
                } else {
                    await interaction.reply({ 
                        embeds: [new ErrorEmbed(error.message)], flags: [MessageFlags.Ephemeral]
                    });
                };
            } catch (e: any) {
                console.error(e);
            };
        };
    }
};