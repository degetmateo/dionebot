"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const EmbedAnime_1 = __importDefault(require("../../../embeds/EmbedAnime"));
const Helpers_1 = __importDefault(require("../../../Helpers"));
const IllegalArgumentException_1 = __importDefault(require("../../../../errores/IllegalArgumentException"));
const AnilistAPI_1 = __importDefault(require("../../../apis/anilist/AnilistAPI"));
const EmbedScores_1 = __importDefault(require("../../../embeds/EmbedScores"));
const InteractionController_1 = __importDefault(require("./InteractionController"));
class AnimeCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
        this.bot = interaction.client;
        this.serverId = interaction.guildId;
        this.query = interaction.options.getString('nombre-o-id');
        this.queryIsNumber = Helpers_1.default.isNumber(this.query);
        this.translate = interaction.options.getBoolean('traducir') || false;
    }
    async execute() {
        await this.interaction.deferReply();
        this.queryIsNumber ?
            await this.findAnimeById() :
            await this.findAnimeByName();
    }
    async findAnimeById() {
        const animeId = parseInt(this.query);
        if (animeId < 0 || animeId > CommandInteraction_1.default.NUMERO_MAXIMO_32_BITS) {
            throw new IllegalArgumentException_1.default('La ID que has ingresado no es válida.');
        }
        const anime = await AnilistAPI_1.default.fetchAnimeById(animeId);
        const embedAnime = this.translate ? await EmbedAnime_1.default.CreateTranslated(anime) : EmbedAnime_1.default.Create(anime);
        const users = this.bot.servers.getUsers(this.serverId);
        const scores = await AnilistAPI_1.default.fetchUsersScores(this.query, users.map(user => user.anilistId));
        const embedScores = EmbedScores_1.default.Create(scores).setColor(anime.obtenerColor());
        try {
            scores.isEmpty() ?
                await this.interaction.editReply({ embeds: [embedAnime] }) :
                await this.interaction.editReply({ embeds: [embedAnime, embedScores] });
        }
        catch (error) {
            await this.interaction.editReply({ embeds: [embedAnime] });
            console.error(error);
        }
    }
    async findAnimeByName() {
        const animes = await AnilistAPI_1.default.fetchAnimeByName(this.query);
        const embeds = animes.map(a => EmbedAnime_1.default.Create(a));
        const controller = new InteractionController_1.default(this.interaction, animes, embeds);
        await controller.execute();
    }
}
exports.default = AnimeCommandInteraction;
