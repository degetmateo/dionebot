import { ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import InteraccionComando from "./InteraccionComando";
import AnilistAPI from "../../apis/AnilistAPI";

export default class InteraccionComandoSeason extends InteraccionComando {
    public static async execute (interaction: ChatInputCommandInteraction<CacheType>) {
        const modulo = new InteraccionComandoSeason(interaction);
        await modulo.execute(interaction);    
    }
    
    protected async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
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