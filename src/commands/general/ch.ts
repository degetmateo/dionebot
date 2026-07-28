import { ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionContextType, SlashCommandBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import mongo from "../../database/mongo";
import { Document, WithId } from "mongodb";
import ChEmbed from "../../builders/embeds/ch.embed";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('ch')
        .setDescription('Tirar por un personaje al azar para reclamar.')
        .setContexts(InteractionContextType.Guild)
        .setNSFW(false),
    execute: async (interaction: GuildChatInputCommandInteraction) => {
        const collection = mongo.collection('characters');
        const result: any[] = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();
        const character: null | WithId<Document> = result.length > 0 ? result[0] : null;
        // const character = await collection.findOne({ _id: new UUID('019f9f2d-74df-71a8-a510-8e5d47992fa8') as any })
        if (!character) return;

        const guilds = mongo.collection('guilds');
        const claimSearch: any = await guilds.findOne(
            {
                discord_id: interaction.guild.id,
                "claimed_characters.character_id": character._id
            },
            {
                projection: {
                    _id: 0,
                    "claimed_characters.$": 1
                }
            }
        );
        
        const owner_id = claimSearch ? claimSearch.claimed_characters[0].member_discord_id : null;

        const embed = new ChEmbed({
            name: character.name,
            site_url: character.url,
            image_url: character.images[0].url,
            claimed_count: character.claimed_count || 0,
            user_id: owner_id
        });

        character.owner_id = owner_id;

        const cache_id = interaction.client.set(character, 25_000);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`ch-claim-button_${cache_id}`)
                    .setEmoji('❤️')
                    .setStyle(ButtonStyle.Secondary)
            )

        return await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};