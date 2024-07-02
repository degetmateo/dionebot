import { ChatInputCommandInteraction, CacheType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import SeasonInteractionController from "./SeasonInteractionController";
import { MediaSeason } from "../../apis/anilist/TiposAnilist";
import AnilistAPI from "../../apis/anilist/AnilistAPI";

export default class SeasonCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        const year: number = this.interaction.options.getInteger("año") as number;
        const season = this.interaction.options.getString("temporada") as MediaSeason;

        const results = await AnilistAPI.fetchSeasonAnimes(year, season);

        const embeds = new Array<EmbedBuilder>();
        const titles = new Array<string>();

        let i = 0;
        titles[0] = '';

        for (const media of results) {
            if (titles[i].length >= 4000) {
                i++;
                titles[i] = '';
            }

            const name = media.title.userPreferred || media.title.romaji || media.title.english || media.title.native;
            titles[i] += `▸ [${name}](${media.siteUrl})\n`;
        }

        for (let J = 0; J < titles.length; J++) {
            const embedInfo = titles[J];

            const embed = new EmbedBuilder()
                .setTitle(`TEMPORADA ${seasons[season]} ${year}`)
                .setDescription(embedInfo)
                .setFooter({ text: `Esto está limitado a 50 resultados.` });

            embeds.push(embed);
        }

        const controller = new SeasonInteractionController(this.interaction, embeds);
        await controller.execute();
    }
}

const seasons = {
    'WINTER': 'INVIERNO',
    'FALL': 'OTOÑO',
    'SUMMER': 'VERANO',
    'SPRING': 'PRIMAVERA'
}