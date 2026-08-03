import { InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import ErrorEmbed from "../../embeds/errorEmbed";
import membersRepository from "../../repositories/members/members.repository";
import charactersRepository from "../../repositories/characters/characters.repository";
import mongo from "../../database/mongo";
import CharacterClaimCardComponent from "../../components/character-claim-card.component";
import Helpers from "../../helpers";
import updateCharacterHelper from "../../helpers/update-character.helper";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('ch')
        .setDescription('Tirar por un personaje al azar para reclamar.')
        .setContexts(InteractionContextType.Guild)
        .setNSFW(false),
    execute: async (interaction: GuildChatInputCommandInteraction) => {
        const member: any = await membersRepository.findsert(interaction.user.id, interaction.guild.id);

        if (member.gacha.pulls <= 0) {
            return interaction.reply({
                flags: "Ephemeral",
                embeds: [new ErrorEmbed('**¡No tienes más pulls!** Volverás a tener \`15 pulls\` en la siguiente hora (esto no se acumula). También puedes comprar \`1 pull\` por \`10 renas\` en \`/gacha buy-pulls\`.')]
            });
        };

        membersRepository.decreasePulls(member._id);

        const character = await charactersRepository.random(); 

        if ((!character.updated_at) || (Helpers.hasPassedMoreThanAMonth(character.updated_at, new Date()))) {
            updateCharacterHelper(character._id as any);
        };

        const claim = await mongo.claims.findOne(
            {
                _id: `${interaction.guild.id}_${character._id}` as any
            }
        );

        const owner_id = claim ? claim.user_id : null;
        character.owner_id = owner_id;

        let popularMedia: any = null;
        let selectedMedia: any = null;
        if (character.media && character.media.length > 0) {
            popularMedia = character.media.sort((a:any, b:any) => b.favourites - a.favourites);
            selectedMedia = popularMedia[0];
        };

        const interaction_id = interaction.client.set(character, 25_000);

        const card = new CharacterClaimCardComponent({
            id: Number(character._id),
            name: character.name,
            image: character.images[0],
            url: character.url,
            media: selectedMedia,
            claimed_count: character.claimed_count || 0,
            fav_count: character.favourites || 0,
            owner_id: owner_id,
            interaction_id: interaction_id
        });

        await interaction.reply({
            flags: [MessageFlags.IsComponentsV2],
            components: [card]
        });
    }
};