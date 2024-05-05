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
class RandomCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        // await this.interaction.deferReply();
        const bot = this.interaction.client;
        const registeredUsers = bot.servers.getUsers(this.interaction.guildId);
        const user = registeredUsers.find(u => u.discordId === this.interaction.user.id);
        if (!user)
            throw new NoResultsException_1.default('No estas registrado.');
        const plannedAnimes = await AnilistAPI_1.default.fetchUserPlannedAnimes(user.anilistId);
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
