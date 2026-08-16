import { InteractionContextType, MessageFlags, SlashCommandBuilder, TextDisplayBuilder, User } from "discord.js";
import GuildChatInputCommandInteraction from "../../../extensions/guildChatInputCommandInteraction.extension";
import membersRepository from "../../../repositories/members/members.repository";
import ErrorEmbed from "../../../embeds/errorEmbed";
import charactersRepository from "../../../repositories/characters/characters.repository";
import Helpers from "../../../helpers";
import updateCharacterHelper from "../../../helpers/update-character.helper";
import mongo from "../../../database/mongo";
import CharacterClaimCardComponent from "../../../components/character-claim-card.component";

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
                flags: [MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder()
                        .setContent(`## 🥀 ¡No tienes más pulls!`),
                    new TextDisplayBuilder()
                        .setContent(`Volverás a tener \`15 pulls\` en la siguiente hora (esto no se acumula). También puedes comprar \`1 pull\` por \`10 renas\` en \`/gacha buy-pulls\`.`)
                ]
            });
        };

        membersRepository.decreasePulls(member._id, interaction.channel.id);

        const character = await charactersRepository.random(); 

        if ((!character.updated_at) || (Helpers.hasPassedMoreThanAMonth(character.updated_at, new Date()))) {
            updateCharacterHelper(character._id as any);
        };

        const claim = await mongo.claims.findOne(
            {
                _id: `${interaction.guild.id}_${character._id}` as any
            }
        );

        let owner: User | null = null;

        if (claim) {
            owner = await interaction.client.users.fetch(claim.user_id);
        };

        character.owner_id = owner?.id;

        let popularMedia: any = null;
        let selectedMedia: any = null;
        
        if (character.media && character.media.length > 0) {
            popularMedia = character.media.sort((a:any, b:any) => b.favourites - a.favourites);
            selectedMedia = popularMedia[0];
        };

        const favs: any[] = await mongo.favourites.find(
            {
                guild_id: interaction.guild.id,
                character_id: character._id
            }
        ).toArray();

        const interaction_id = interaction.client.set(character, 60_000);

        const card = new CharacterClaimCardComponent({
            id: Number(character._id),
            name: character.name,
            image: character.images[0],
            url: character.url,
            media: selectedMedia,
            claimed_count: character.claimed_count || 0,
            fav_count: character.favourites || 0,
            owner: owner,
            interaction_id: interaction_id,
            users_who_want: favs
        });

        await interaction.reply({
            flags: [MessageFlags.IsComponentsV2],
            components: [card]
        });
    }
};