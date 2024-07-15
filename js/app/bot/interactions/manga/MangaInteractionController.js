"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = __importDefault(require("../../Helpers"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const EmbedManga_1 = __importDefault(require("../../embeds/EmbedManga"));
const EmbedScores_1 = __importDefault(require("../../embeds/EmbedScores"));
const InteractionController_1 = __importDefault(require("../InteractionController"));
const postgres_1 = __importDefault(require("../../../database/postgres"));
class MangaInteractionController extends InteractionController_1.default {
    constructor(interaction, mangas) {
        super(interaction, mangas);
    }
    async execute() {
        const serverId = this.interaction.guildId;
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
            await Helpers_1.default.asyncMap(this.media, async (manga) => await EmbedManga_1.default.CreateTranslated(manga)) :
            this.media.map(manga => EmbedManga_1.default.Create(manga));
        const manga = this.media[this.page];
        const scores = await this.fetchUsersUsernames(await AnilistAPI_1.default.fetchUsersScores(manga.getId() + '', queryUsers.map(u => u.id_anilist + '')));
        const embedManga = this.embeds[this.page];
        const embedScores = EmbedScores_1.default.Create(scores).setColor(manga.getColor());
        const embeds = (!scores.isEmpty()) ?
            [embedManga, embedScores] : [embedManga];
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
            throw error;
        }
    }
}
exports.default = MangaInteractionController;
