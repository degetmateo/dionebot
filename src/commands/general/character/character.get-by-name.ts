import { MessageFlags } from "discord.js";
import anilist from "../../../apis/anilist/anilist";
import CharacterInfoCardComponent from "../../../components/character-info-card.component";
import mongo from "../../../database/mongo";
import ErrorEmbed from "../../../embeds/errorEmbed";
import GuildChatInputCommandInteraction from "../../../extensions/guildChatInputCommandInteraction.extension";
import Bot from "../../../extensions/bot.extension";

export const characterGetbyName = async (interaction: GuildChatInputCommandInteraction) => {
    const args: string = interaction.options.getString('name-or-id', true);
    const data = await anilist.get.character.name(args);

    if (!data || data.length <= 0) {
        return await interaction.reply({
            flags: 'Ephemeral',
            embeds: [new ErrorEmbed('No hemos encontrado resultados.')]
        });
    };

    const claims = await mongo.claims.find(
        {
            guild_id: interaction.guild.id,
            character_id: {
                $in: data.map((c: any) => c.id)
            }
        }
    ).toArray();

    const cards: CharacterInfoCardComponent[] = [];
    const key = interaction.client.set({}, 120_000);

    for (const elem of data) {
        const claim = claims.find(c => c._id === elem.id);

        const images = [{ url: elem.image.large || elem.image.medium }];
        const popularMedia = elem.media.nodes.sort((a:any, b:any) => b.favourites - a.favourites);
        const selectedMedia = popularMedia[0];

        const owner = claim ?
            await (interaction.client as Bot).users.fetch(claim.user_id):
            null;

        const card = new CharacterInfoCardComponent({
            id: elem.id,
            name: elem.name.full,
            fav_count: elem.favourites,
            url: elem.siteUrl,
            interaction_id: key,
            owner: owner ? { username: owner.username } : undefined,
            media: {
                id: selectedMedia.id,
                siteUrl: selectedMedia.siteUrl,
                title: selectedMedia.title.userPreferred
            },
            claimed_count: null,
            image: images[0],

            gender: elem.gender || null,
            age: elem.age || null,
            bloodType: elem.bloodType || null,
            page_buttons: data.length >= 1
        });

        cards.push(card);
    };

    let index = 0;
    interaction.client.update(key, {
        index,
        cards
    }, 120_000);

    await interaction.reply({
        flags: [MessageFlags.IsComponentsV2],
        components: [cards[index]]
    });
};