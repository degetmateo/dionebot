"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    cooldown: 5,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('cry')
        .setNameLocalization('es-ES', 'llorar')
        .setDescription("You're crying...")
        .setDescriptionLocalization('es-ES', 'Estás llorando...')
        .setDMPermission(false)
        .setNSFW(false),
    execute: async (interaction) => {
        const res = await fetch('https://nekos.best/api/v2/cry', { method: 'GET' });
        const data = await res.json();
        const imageURL = data.results[0].url;
        const embed = new discord_js_1.EmbedBuilder()
            .setImage(imageURL)
            .setColor('Random')
            .setDescription(`**${interaction.user.username}** está llorando :(`);
        await interaction.reply({
            embeds: [embed]
        });
    }
};
