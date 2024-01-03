import { ChatInputCommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import { MediaTemporada } from "../../apis/anilist/tipos/TiposMedia";
import CommandInteraction from "../interactions/CommandInteraction";

export default class InteraccionComandoSeason extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;

    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }
    
    public async execute (): Promise<void> {
        await this.interaction.deferReply();

        const anio: number = this.interaction.options.getInteger("año") as number;
        const temporada = this.interaction.options.getString("temporada") as MediaTemporada;

        const resultados = await AnilistAPI.buscarAnimesTemporada(anio, temporada);

        const embed = new EmbedBuilder()
            .setTitle(`${temporada} ${anio}`);

        let description = "";

        for (const media of resultados) {
            if (description.length >= 4000) break;
            const nombre = media.title.english ? media.title.english : media.title.romaji;
            description += `▸ ${nombre}\n`;
        }

        embed.setDescription(description);
        this.interaction.editReply({ embeds: [embed] });
    }
}