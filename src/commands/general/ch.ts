import { ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionContextType, SlashCommandBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import mongo from "../../database/mongo";
import { Document, WithId } from "mongodb";
import CharacterEmbed from "../../builders/embeds/character.embed";

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

        if (!character) return;
        
        const embed = new CharacterEmbed({
            name: character.name,
            site_url: character.url,
            image_url: character.images[0].url,
            favourites_count: character.favourites || 0,
            claimed_count: character.claimed_count || 0
        });

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