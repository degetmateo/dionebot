import { ButtonInteraction, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder } from "discord.js";
import ErrorEmbed from "../../../embeds/errorEmbed";
import Bot from "../../../bot/bot";
import membersRepository from "../../../repositories/members/members.repository";

module.exports = {
    id: 'renas-button',
    execute: async (interaction: ButtonInteraction, character: {
        key: string;
        _id: number;
        name: string;
        site_url: string;
        image_url: string;
        owner_id: string;
    }) => {
        if (!character) {
            return await interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed('Esta interacción ha expirado o se te han adelantado.')]
            });
        };

        const bot = interaction.client as Bot;
        bot.delete(character.key);

        const owner = await (interaction.client as Bot).users.fetch(character.owner_id);
        const renas = bot.settings.renas_per_reclaim;

        if (character.owner_id != interaction.user.id) {
            const dividedRenas = Math.floor(renas / 2);
            
            membersRepository.increaseRenas(character.owner_id, dividedRenas);
            membersRepository.increaseRenas(interaction.user.id, dividedRenas);

            const comps = [
                new TextDisplayBuilder()
                    .setContent(`¡**${character.name}** ya pertenece a **${owner.displayName}**!`),
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(SeparatorSpacingSize.Small),
                new TextDisplayBuilder()
                    .setContent(`\`(+${dividedRenas} renas)\` para **${owner.displayName}**\n`),
                new TextDisplayBuilder()
                    .setContent(`\`(+${dividedRenas} renas)\` para **${interaction.user.displayName}**\n`)
            ];

            await interaction.reply({
                flags: [MessageFlags.IsComponentsV2],
                components: comps
            });
        } else {
            membersRepository.increaseRenas(character.owner_id, renas);

            const comps = [
                new TextDisplayBuilder()
                    .setContent(`¡**${character.name}** ya pertenece a **${owner.displayName}**!`),
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(SeparatorSpacingSize.Small),
                new TextDisplayBuilder()
                    .setContent(`\`(+${renas} renas)\` para **${owner.displayName}**\n`)
            ];

            await interaction.reply({
                flags: [MessageFlags.IsComponentsV2],
                components: comps
            });
        };
    }
}