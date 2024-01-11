"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmbedAnime_1 = __importDefault(require("../../../embeds/EmbedAnime"));
const AnilistAPI_1 = __importDefault(require("../../../apis/anilist/AnilistAPI"));
const EmbedScores_1 = __importDefault(require("../../../embeds/EmbedScores"));
const InteractionController_1 = __importDefault(require("../InteractionController"));
class AnimeInteractionController extends InteractionController_1.default {
    constructor(interaction, animes) {
        super(interaction, animes);
    }
    async execute() {
        const serverId = this.interaction.guildId;
        const users = this.bot.servers.getUsers(serverId);
        this.embeds = this.media.map(media => EmbedAnime_1.default.Create(media));
        const anime = this.media[this.page];
        const scores = await this.fetchUsersUsernames(await AnilistAPI_1.default.fetchUsersScores(anime.obtenerID() + '', users.map(u => u.anilistId)));
        const embedAnime = this.embeds[this.page];
        const embedScores = EmbedScores_1.default.Create(scores).setColor(anime.obtenerColor());
        const embeds = (!scores.isEmpty()) ?
            [embedAnime, embedScores] : [embedAnime];
        if (this.media.length === 1) {
            await this.interaction.editReply({
                embeds: embeds
            });
            return;
        }
        const res = await this.interaction.editReply({
            embeds: embeds,
            components: [this.row]
        });
        await this.createCollector(res);
    }
}
exports.default = AnimeInteractionController;
