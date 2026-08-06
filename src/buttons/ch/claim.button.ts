import { ButtonInteraction, MessageFlags } from "discord.js";
import ErrorEmbed from "../../embeds/errorEmbed";
import Bot from "../../extensions/bot.extension";
import SuccessEmbed from "../../embeds/successEmbed";
import membersRepository from "../../repositories/members/members.repository";
import GenericError from "../../errors/genericError";
import charactersRepository from "../../repositories/characters/characters.repository";
import mongo from "../../database/mongo";

module.exports = {
    id: 'claim-button',
    execute: async (interaction: ButtonInteraction, character: {
        key: string;
        _id: number;
        name: string;
        site_url: string;
        image_url: string;
    }) => {
        if (!character) {
            return await interaction.reply({
                flags: "Ephemeral",
                embeds: [new ErrorEmbed('Este personaje ha expirado o se te han adelantado.')]
            });
        };

        const bot = interaction.client as Bot;
        const memberWhoWantsToClaim: any = await membersRepository.findsert(interaction.user.id, interaction.guild?.id as string);

        if (memberWhoWantsToClaim.gacha.claims <= 0) {
            return interaction.reply({
                flags: "Ephemeral",
                embeds: [new ErrorEmbed(`**¡Te has quedado sin claims!** Volverás a tener \`2 claims\` en la siguiente hora (esto no se acumula). También puedes comprar \`1 claim\` por \`100 renas\` en \`/gacha buy-claims\`.`)]
            });
        };

        const race = bot.get(character.key);
        
        if (!race) {
            return await interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed('¡Se te han adelantado!')]
            });
        };
        
        bot.delete(character.key);

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