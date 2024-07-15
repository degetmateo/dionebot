"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = __importDefault(require("../../Helpers"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const EmbedAnime_1 = __importDefault(require("../../embeds/EmbedAnime"));
const EmbedScores_1 = __importDefault(require("../../embeds/EmbedScores"));
const InteractionController_1 = __importDefault(require("../InteractionController"));
const postgres_1 = __importDefault(require("../../../database/postgres"));
class AnimeInteractionController extends InteractionController_1.default {
    constructor(interaction, animes) {
        super(interaction, animes);
    }
    async execute() {
        const serverId = this.interaction.guild.id;
        const translate = this.interaction.options.getBoolean('traducir') || false;
        const queryUsers = await postgres_1.default.query() `
            SELECT * FROM
                discord_user du
            JOIN
                membership mem
            ON
                mem.id_server = ${serverId} and
                mem.id_user = du.id_user;
        `;
        this.embeds = translate ?
            await Helpers_1.default.asyncMap(this.media, async (anime) => await EmbedAnime_1.default.CreateTranslated(anime)) :
            this.media.map(media => EmbedAnime_1.default.Create(media));
        const anime = this.media[this.page];
        const scores = await this.fetchUsersUsernames(await AnilistAPI_1.default.fetchUsersScores(anime.getId() + '', queryUsers.map(u => u.id_anilist + '')));
        const embedAnime = this.embeds[this.page];
        const embedScores = EmbedScores_1.default.Create(scores).setColor(anime.getColor());
        const embeds = (!scores.isEmpty()) ?
            [embedAnime, embedScores] : [embedAnime];
        if (this.media.length === 1) {
            await this.interaction.editReply({
                embeds: embeds
            });
            return;
        }
        try {
            const res = await this.interaction.editReply({
                embeds: embeds,
                components: [this.row]
            });
            await this.createCollector(res);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.default = AnimeInteractionController;
