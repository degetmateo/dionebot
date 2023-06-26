"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Media_1 = require("../modulos/Media");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("season")
        .setDescription("Devuelve los animes que salieron en el año y en la temporada pasados como parámetro.")
        .addIntegerOption(option => option
        .setName("año")
        .setDescription("El año en el que se emitieron los animes.")
        .setRequired(true))
        .addStringOption(option => option
        .setName("temporada")
        .setDescription("La temporada en la que se emitieron los animes.")
        .addChoices({ name: "PRIMAVERA", value: "SPRING" }, { name: "VERANO", value: "SUMMER" }, { name: "INVIERNO", value: "WINTER" }, { name: "OTOÑO", value: "FALL" })
        .setRequired(true)),
    execute: async (interaction) => {
        const bot = interaction.client;
        const seasonYear = interaction.options.getInteger("año");
        const season = interaction.options.getString("temporada");
        if (!seasonYear || !season) {
            return interaction.reply({
                content: "Ha ocurrido un error.",
                ephemeral: true
            });
        }
        await interaction.deferReply();
        try {
            const animes = await Media_1.Media.BuscarMediaPorTemporada(seasonYear, season);
            console.log(animes);
            console.log(animes.length);
            if (!animes || animes.length <= 0) {
                return interaction.editReply({
                    content: "No hay animes disponibles para esa temporada."
                });
            }
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(`${season} ${seasonYear}`);
            let description = "";
            for (let i = 0; i < animes.length; i++) {
                if (description.length >= 4000)
                    break;
                const nombre = animes[i].title.english ? animes[i].title.english : animes[i].title.romaji;
                description += `▸ ${nombre}\n`;
            }
            embed.setDescription(description);
            return interaction.editReply({ embeds: [embed] });
        }
        catch (err) {
            console.error(err);
            return interaction.editReply({
                content: "Ha ocurrido un error. Inténtalo más tarde."
            });
        }
    }
};
