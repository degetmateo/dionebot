import { ButtonInteraction, MessageFlags } from "discord.js";
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

        const renas = bot.settings.renas_per_reclaim;

        if (character.owner_id != interaction.user.id) {
            const dividedRenas = Math.floor(renas / 2);
            membersRepository.increaseRenas(character.owner_id, dividedRenas);
            membersRepository.increaseRenas(interaction.user.id, dividedRenas);
            const desc = 
                `¡**${character.name}** ya pertenece a <@${character.owner_id}>!\n\n`+
                `\`(+${dividedRenas} renas)\` <@${character.owner_id}>\n`+
                `\`(+${dividedRenas} renas)\` <@${interaction.user.id}>\n`
            ;

            return await interaction.reply({
                embeds: [new ErrorEmbed(desc)]
            });
        } else {
            membersRepository.increaseRenas(character.owner_id, renas);

            const desc = 
                `¡**${character.name}** ya pertenece a <@${character.owner_id}>!\n\n`+
                `\`(+${renas} renas)\` <@${character.owner_id}>\n`
            ;

            return await interaction.reply({
                embeds: [new ErrorEmbed(desc)]
            });
        };
    }
}