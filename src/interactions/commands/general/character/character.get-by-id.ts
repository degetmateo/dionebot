import { MessageFlags, User } from "discord.js";
import GuildChatInputCommandInteraction from "../../../../extensions/guildChatInputCommandInteraction.extension";
import anilist from "../../../../apis/anilist/anilist";
import ErrorEmbed from "../../../../embeds/errorEmbed";
import mongo from "../../../../database/mongo";
import Helpers from "../../../../helpers";
import CharacterInfoCardComponent from "../../../../components/character-info-card.component";

export const characterGetbyId = async (interaction: GuildChatInputCommandInteraction) => {
    const args: number = Number(interaction.options.getString('name-or-id', true));
    const data = await anilist.get.character.id(args);

    if (!data) {
        return await interaction.reply({
            flags: 'Ephemeral',
            embeds: [new ErrorEmbed('No hemos encontrado resultados.')]
        });
    };

    const character = await mongo.characters.findOne({ _id: data.id });

    let owner_id: string | null = null;
    let claimed_count: number = 0;
    let images = [{ url: data.image.large || data.image.medium }];

    const parsed = {
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
    };

    if (character) {
        claimed_count = character.claimed_count;
        
        const claim = await mongo.claims.findOne(
            {
                _id: `${interaction.guild.id}_${character._id}` as any
            }
        );

        if (claim) {
            owner_id = claim.user_id;
        };

        if ((!character.updated_at) || (Helpers.hasPassedMoreThanAMonth(character.updated_at, new Date()))) {
            mongo.characters.updateOne(
                {
                    _id: character._id
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

    let owner: User | undefined;
    
    if (owner_id) {
        owner = await interaction.client.users.fetch(owner_id);
    };

    const popularMedia = data.media.nodes.sort((a:any, b:any) => b.favourites - a.favourites);
    const selectedMedia = popularMedia[0]

    const interaction_id = interaction.client.set({}, 120_000);

    const card = new CharacterInfoCardComponent({
        id: data.id,
        name: data.name.full,
        fav_count: data.favourites,
        url: data.siteUrl,
        interaction_id: interaction_id,
        owner: owner ? { username: owner.username } : undefined,
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

    interaction.client.update(interaction_id, {
        index: 0,
        cards: [card]
    }, 120_000);

    await interaction.reply({
        flags: [MessageFlags.IsComponentsV2],
        components: [card]
    });
};