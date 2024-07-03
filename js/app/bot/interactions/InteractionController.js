"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Button_1 = __importDefault(require("../components/Button"));
const CommandInteraction_1 = __importDefault(require("./CommandInteraction"));
const AnilistAPI_1 = __importDefault(require("../apis/anilist/AnilistAPI"));
const EmbedScores_1 = __importDefault(require("../embeds/EmbedScores"));
const TooManyRequestsException_1 = __importDefault(require("../../errors/TooManyRequestsException"));
const postgres_1 = __importDefault(require("../../database/postgres"));
class InteractionController {
    constructor(interaction, media) {
        this.buttonPreviousPage = Button_1.default.CreatePrevious();
        this.buttonNextPage = Button_1.default.CreateNext();
        this.row = new discord_js_1.ActionRowBuilder()
            .addComponents(this.buttonPreviousPage, this.buttonNextPage);
        this.page = 0;
        this.lastPage = media.length - 1;
        this.interaction = interaction;
        this.media = media;
        this.bot = interaction.client;
    }
    async createCollector(res) {
        try {
            const collector = res.createMessageComponentCollector({
                time: CommandInteraction_1.default.TIEMPO_ESPERA_INTERACCION
            });
            collector.on('collect', async (button) => {
                await button.deferUpdate();
                if (button.customId === Button_1.default.PreviousButtonID) {
                    this.page--;
                    if (this.page < 0)
                        this.page = this.lastPage;
                }
                if (button.customId === Button_1.default.NextButtonID) {
                    this.page++;
                    if (this.page > this.lastPage)
                        this.page = 0;
                }
                await this.updateInteraction(button);
            });
        }
        catch (error) {
            throw error;
        }
    }
    async updateInteraction(button) {
        const serverId = button.guild.id;
        const queryUsers = await postgres_1.default.query() `
            SELECT * FROM
                discord_user
            WHERE
                id_server = ${serverId};
        `;
        try {
            const media = this.media[this.page];
            const scores = await this.fetchUsersUsernames(await AnilistAPI_1.default.fetchUsersScores(media.getId() + '', queryUsers.map(u => u.id_anilist + '')));
            if (scores.isEmpty()) {
                await button.editReply({ embeds: [this.embeds[this.page]], components: [this.row] });
            }
            else {
                const embedScores = EmbedScores_1.default.Create(scores).setColor(media.getColor());
                await button.editReply({ embeds: [this.embeds[this.page], embedScores], components: [this.row] });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message.toLowerCase().includes('too many requests')) {
                    throw new TooManyRequestsException_1.default('Se han realizado demasiadas peticiones al servidor. Inténtalo más tarde.');
                }
            }
            throw error;
        }
    }
    async fetchUsersUsernames(scores) {
        const serverId = this.interaction.guild.id;
        const queryUsers = await postgres_1.default.query() `
            SELECT * FROM
                discord_user
            WHERE
                id_server = ${serverId};
        `;
        for (const score of scores.getMediaList()) {
            const discordUser = queryUsers.find(u => u.id_anilist == score.user.id);
            score.user.name = (await this.bot.fetchUser(discordUser.id_user)).username;
        }
        return scores;
    }
}
exports.default = InteractionController;
