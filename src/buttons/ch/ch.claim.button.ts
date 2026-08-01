import { ButtonInteraction } from "discord.js";
import ErrorEmbed from "../../embeds/errorEmbed";
import Bot from "../../extensions/bot.extension";
import SuccessEmbed from "../../embeds/successEmbed";
import claimCooldownHelper from "../../helpers/claim.cooldown.helper";
import guildsRepository from "../../repositories/guilds/guilds.repository";
import membersRepository from "../../repositories/members/members.repository";
import GenericError from "../../errors/genericError";
import charactersRepository from "../../repositories/characters/characters.repository";
import mongo from "../../database/mongo";

module.exports = {
    id: 'ch-claim-button',
    execute: async (interaction: ButtonInteraction, character: {
        key: string;
        _id: number;
        name: string;
        site_url: string;
        image_url: string;
        owner_id: string | null;
    }) => {
        if (!character) {
            return await interaction.reply({
                flags: "Ephemeral",
                embeds: [new ErrorEmbed('Esta interacción ha expirado.')]
            });
        };

        const bot = interaction.client as Bot;

        if (character.owner_id) {
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
        };

        const memberWhoWantsToClaim: any = await membersRepository.findsert(interaction.user.id, interaction.guild?.id as string);

        if (memberWhoWantsToClaim.gacha.claims <= 0) {
            return interaction.reply({
                flags: "Ephemeral",
                embeds: [new ErrorEmbed(`**¡Te has quedado sin claims!** Volverás a tener \`2 claims\` en la siguiente hora (esto no se acumula). También puedes comprar \`1 claim\` por \`100 renas\` en \`/gacha buy-claims\`.`)]
            });
        };

        const race = bot.get(character.key);
        if (!race) throw new GenericError('Esta interacción ha expirado.');
        bot.delete(character.key);

        // claimCooldownHelper.execute(interaction);

        mongo.claims.insertOne({
            _id: `${interaction.guild?.id}_${character._id}` as any,
            guild_id: interaction.guild?.id,
            character_id: character._id,
            user_id: interaction.user.id
        });

        membersRepository.decreaseClaims(memberWhoWantsToClaim._id);
        membersRepository.increaseClaimCount(memberWhoWantsToClaim._id);

        charactersRepository.increaseClaimCount(character._id);

        interaction.reply({
            embeds: [new SuccessEmbed(`¡<@${interaction.user.id}> ha reclamado a **${character.name}**!`)]
        });
    }
};