import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, InteractionContextType, SlashCommandBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import mongo from "../../database/mongo";
import { Document, WithId } from "mongodb";

module.exports = {
    cooldown: 1,
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
        
        const embed = new EmbedBuilder()
            .setTitle(character.name)
            .setURL(character.url)
            .setImage(character.images[0].url)
            .setColor('Random')
            .setFooter({ text: `${character.favourites || 0} favs` })
        ;

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ch-claim-button')
                    .setEmoji('❤️')
                    .setStyle(ButtonStyle.Secondary)
            )

        return await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};