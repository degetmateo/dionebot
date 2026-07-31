import { ButtonInteraction } from "discord.js";
import { ObjectId} from "mongodb";
import ErrorEmbed from "../../embeds/errorEmbed";
import Bot from "../../extensions/bot.extension";
import mongo from "../../database/mongo";
import SuccessEmbed from "../../embeds/successEmbed";
import claimCooldownHelper from "../../helpers/claim.cooldown.helper";
import { memberModel } from "../../database/models/member.model";
import guildsRepository from "../../repositories/guilds/guilds.repository";
import membersRepository from "../../repositories/members/members.repository";
import GenericError from "../../errors/genericError";
import charactersRepository from "../../repositories/characters/characters.repository";

module.exports = {
    id: 'ch-claim-button',
    execute: async (interaction: ButtonInteraction, character: {
        key: string;
        _id: ObjectId;
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
            const renas = bot.settings.renas_per_reclaim;
            membersRepository.increaseRenas(character.owner_id, renas);

            return await interaction.reply({
                embeds: [new ErrorEmbed(`¡**${character.name}** ya pertenece a <@${character.owner_id}>! \`(+${renas} renas)\``)]
            });
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

        claimCooldownHelper.execute(interaction);

        const guild = await guildsRepository.findsert(interaction.guild?.id as string);
        guildsRepository.pushClaim(guild._id, { character_id: character._id, member_discord_id: interaction.user.id });

        membersRepository.decreaseClaims(memberWhoWantsToClaim._id);
        membersRepository.increaseClaimCount(memberWhoWantsToClaim._id);
        charactersRepository.increaseClaimCount(character._id);

        interaction.reply({
            embeds: [new SuccessEmbed(`¡<@${interaction.user.id}> ha reclamado a **${character.name}**!`)]
        });
    }
};