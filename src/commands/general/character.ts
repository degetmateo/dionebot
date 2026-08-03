import { InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import Helpers from "../../helpers";
import anilist from "../../apis/anilist/anilist";
import ErrorEmbed from "../../embeds/errorEmbed";
import mongo from "../../database/mongo";
import CharacterInfoCardComponent from "../../components/character-info-card.component";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('character')
        .setDescription('Buscar un personaje y toda su información.')
        .setNSFW(false)
        .setContexts(InteractionContextType.Guild)
        .addStringOption(option =>
            option
                .setName('name-or-id')
                .setDescription('Nombre o identificador del personaje.')
                .setRequired(true)
        ),
    execute: async (interaction: GuildChatInputCommandInteraction) => {
        const args = interaction.options.getString('name-or-id', true);
        
        const data = Helpers.isNumber(args) ?
            await anilist.get.character.id(args):
            await anilist.get.character.name(args);

        if (!data) {
            return await interaction.reply({
                flags: 'Ephemeral',
                embeds: [new ErrorEmbed('No hemos encontrado resultados.')]
            });
        };

        const char = await mongo.characters.findOne({ _id: data.id });

        let owner_id: string | null = null;
        let claimed_count: number = 0;
        let images = [{ url: data.image.large || data.image.medium }];
        
        if (char) {
            claimed_count = char.claimed_count;
            
            const claim = await mongo.claims.findOne(
                {
                    _id: `${interaction.guild.id}_${char._id}` as any
                }
            );

            if (claim) {
                owner_id = claim.user_id;
            };

            if ((!char.updated_at) || (Helpers.hasPassedMoreThanAMonth(char.updated_at, new Date()))) {
                mongo.characters.updateOne(
                    {
                        _id: char._id
                    },
                    {
                        $set: {
                            updated_at: new Date(),
                            name: data.name.full || data.name.userPreferred,
                            favourites: data.favourites,
                            media: data.media.nodes,
                            images: images
                        }
                    }
                );
            };
        } else {
            mongo.characters.insertOne({
                _id: data.id,
                url: data.siteUrl,
                gender: data.gender || null,
                age: data.age || null,
                favourites: data.favourites || 0,
                name: data.name.full || data.name.userPreferred,
                media: data.media.nodes,
                images: images,
                claimed_count: 0,
                updated_at: new Date()
            });
        };

        const popularMedia = data.media.nodes.sort((a:any, b:any) => b.favourites - a.favourites);
        const selectedMedia = popularMedia[0]

        const interaction_id = interaction.client.set(data, 120_000);

        const card = new CharacterInfoCardComponent({
            id: data.id,
            name: data.name.full,
            fav_count: data.favourites,
            url: data.siteUrl,
            interaction_id: interaction_id,
            owner_id: owner_id,
            media: {
                id: selectedMedia.id,
                siteUrl: selectedMedia.siteUrl,
                title: selectedMedia.title.userPreferred
            },
            claimed_count: claimed_count,
            image: images[0],

            gender: data.gender || null,
            age: data.age || null,
            bloodType: data.bloodType || null
        }); 

        await interaction.reply({
            flags: [MessageFlags.IsComponentsV2],
            components: [card]
        });
    }
};