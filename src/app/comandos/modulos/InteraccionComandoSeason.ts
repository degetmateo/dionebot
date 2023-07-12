import { ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import InteraccionComando from "./InteraccionComando";
import AnilistAPI from "../../apis/AnilistAPI";
import { MediaTemporada } from "../../apis/anilist/types/Media";

export default class InteraccionComandoSeason extends InteraccionComando {
    protected interaction: ChatInputCommandInteraction<CacheType>;

    private constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public static async execute (interaction: ChatInputCommandInteraction<CacheType>) {
        const modulo = new InteraccionComandoSeason(interaction);
        await modulo.execute(interaction);    
    }
    
    protected async execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply();

        const anio: number = interaction.options.getInteger("año") as number;
        const temporada = interaction.options.getString("temporada") as MediaTemporada;

        const resultados = await AnilistAPI.obtenerAnimesTemporada(anio, temporada);

        const embed = new EmbedBuilder()
            .setTitle(`${temporada} ${anio}`);

        let description = "";

        for (const media of resultados) {
            if (description.length >= 4000) break;
            const nombre = media.title.english ? media.title.english : media.title.romaji;
            description += `▸ ${nombre}\n`;
        }

        embed.setDescription(description);
        interaction.editReply({ embeds: [embed] });
    }
}