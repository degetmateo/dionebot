"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const NoResultsException_1 = __importDefault(require("../../../errors/NoResultsException"));
const Helpers_1 = __importDefault(require("../../Helpers"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const EmbedAnime_1 = __importDefault(require("../../embeds/EmbedAnime"));
const postgres_1 = __importDefault(require("../../../database/postgres"));
class RandomCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        const userId = this.interaction.user.id;
        const serverId = this.interaction.guild.id;
        const queryMembership = await postgres_1.default.query() `
            SELECT * FROM
                membership
            WHERE
                id_user = ${userId} and
                id_server = ${serverId};
        `;
        if (!queryMembership[0])
            throw new NoResultsException_1.default('No estas registrado.');
        const queryUser = await postgres_1.default.query() `
            SELECT * FROM
                discord_user
            WHERE
                id_user = ${userId};
        `;
        const plannedAnimes = await AnilistAPI_1.default.fetchUserPlannedAnimes(queryUser[0].id_anilist);
        const randomAnime = Helpers_1.default.getRandomElement(plannedAnimes.lists[0].entries);
        if (!randomAnime)
            throw new NoResultsException_1.default('No se han encontrado animes planeados.');
        const anime = await AnilistAPI_1.default.fetchAnimeById(randomAnime.mediaId);
        const embed = EmbedAnime_1.default.Create(anime);
        try {
            await this.interaction.reply({ embeds: [embed] });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = RandomCommandInteraction;
