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
            await this.interaction.editReply({ components: [] });
            console.error(error);
        }
    }
    async updateInteraction(button) {
        const users = this.bot.servers.getUsers(button.guildId);
        try {
            const media = this.media[this.page];
            const scores = await this.fetchUsersUsernames(await AnilistAPI_1.default.fetchUsersScores(media.getId() + '', users.map(u => u.anilistId)));
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
                    await button.editReply({ embeds: [this.embeds[this.page]], components: [] });
                    return;
                }
            }
            await button.editReply({ embeds: [this.embeds[this.page]], components: [this.row] });
            console.error(error);
        }
    }
    async fetchUsersUsernames(scores) {
        const users = this.bot.servers.getUsers(this.interaction.guildId);
        for (const score of scores.getMediaList()) {
            const discordUser = users.find(u => parseInt(u.anilistId) === score.user.id);
            score.user.name = (await this.bot.fetchUser(discordUser.discordId)).username;
        }
        return scores;
    }
}
exports.default = InteractionController;
