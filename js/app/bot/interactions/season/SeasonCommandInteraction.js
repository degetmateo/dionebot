"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const SeasonInteractionController_1 = __importDefault(require("./SeasonInteractionController"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
class SeasonCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        const year = this.interaction.options.getInteger("año");
        const season = this.interaction.options.getString("temporada");
        const results = await AnilistAPI_1.default.fetchSeasonAnimes(year, season);
        const embeds = new Array();
        const titles = new Array();
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
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(`TEMPORADA ${seasons[season]} ${year}`)
                .setDescription(embedInfo)
                .setFooter({ text: `Esto está limitado a 50 resultados.` });
            embeds.push(embed);
        }
        const controller = new SeasonInteractionController_1.default(this.interaction, embeds);
        await controller.execute();
    }
}
exports.default = SeasonCommandInteraction;
const seasons = {
    'WINTER': 'INVIERNO',
    'FALL': 'OTOÑO',
    'SUMMER': 'VERANO',
    'SPRING': 'PRIMAVERA'
};
