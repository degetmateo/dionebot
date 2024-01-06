"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const CommandInteraction_1 = __importDefault(require("../interactions/CommandInteraction"));
class InteraccionComandoSeason extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        await this.interaction.deferReply();
        const anio = this.interaction.options.getInteger("año");
        const temporada = this.interaction.options.getString("temporada");
        const resultados = await AnilistAPI_1.default.buscarAnimesTemporada(anio, temporada);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`${temporada} ${anio}`);
        let description = "";
        for (const media of resultados) {
            if (description.length >= 4000)
                break;
            const nombre = media.title.english ? media.title.english : media.title.romaji;
            description += `▸ ${nombre}\n`;
        }
        embed.setDescription(description);
        this.interaction.editReply({ embeds: [embed] });
    }
}
exports.default = InteraccionComandoSeason;
