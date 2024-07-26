"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const AnimeInteractionController_1 = __importDefault(require("./AnimeInteractionController"));
const IllegalArgumentException_1 = __importDefault(require("../../../errors/IllegalArgumentException"));
const Helpers_1 = __importDefault(require("../../Helpers"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
class AnimeCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
        this.query = interaction.options.getString('name-or-id');
        this.queryIsNumber = Helpers_1.default.isNumber(this.query);
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
        const controller = new AnimeInteractionController_1.default(this.interaction, [anime]);
        await controller.execute();
    }
    async findAnimeByName() {
        const animes = await AnilistAPI_1.default.fetchAnimeByName(this.query);
        const controller = new AnimeInteractionController_1.default(this.interaction, animes);
        await controller.execute();
    }
}
exports.default = AnimeCommandInteraction;
