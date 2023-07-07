import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import AnilistAPI from "../apis/AnilistAPI";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("season")
        .setDescription("Devuelve los animes que salieron en el año y en la temporada pasados como parámetro.")
        .addIntegerOption(option =>
            option
                .setName("año")
                .setDescription("El año en el que se emitieron los animes.")
                .setRequired(true))
        .addStringOption(option => 
            option
                .setName("temporada")
                .setDescription("La temporada en la que se emitieron los animes.")
                .addChoices({ name: "PRIMAVERA", value: "SPRING" },
                            { name: "VERANO", value: "SUMMER" },
                            { name: "INVIERNO", value: "WINTER" },
                            { name: "OTOÑO", value: "FALL" })
                .setRequired(true)),

    execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
        await interaction.deferReply();

        const anio: number = interaction.options.getInteger("año") as number;
        const temporada: string = interaction.options.getString("temporada") as string;

        const resultado = await AnilistAPI.obtenerAnimesTemporada(anio, temporada);
        const animes = resultado.media;

        const embed = new EmbedBuilder()
            .setTitle(`${temporada} ${anio}`);

        let description = "";

        for (let i = 0; i < animes.length; i++) {
            if (description.length >= 4000) break;
            const nombre = animes[i].title.english ? animes[i].title.english : animes[i].title.romaji;
            description += `▸ ${nombre}\n`;
        }

        embed.setDescription(description);
        interaction.editReply({ embeds: [embed] });
    }
}