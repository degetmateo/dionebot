import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, CacheType, ColorResolvable } from "discord.js";
import Helpers from "../Helpers";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('cry')
        .setNameLocalization('es-ES', 'llorar')
        .setDescription("You're crying...")
        .setDescriptionLocalization('es-ES', 'Estás llorando...')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const res = await fetch ('https://nekos.best/api/v2/cry', { method: 'GET' });
        const data = await res.json();
        const imageURL = data.results[0].url;

        const embed = new EmbedBuilder()
            .setImage(imageURL)
            .setColor('Random')
            .setDescription(`**${interaction.user.username}** está llorando :(`);

        await interaction.reply({
            embeds: [embed]
        })
    }
}