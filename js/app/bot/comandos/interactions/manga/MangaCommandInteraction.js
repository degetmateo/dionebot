"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const Helpers_1 = __importDefault(require("../../../Helpers"));
const IllegalArgumentException_1 = __importDefault(require("../../../../errores/IllegalArgumentException"));
const AnilistAPI_1 = __importDefault(require("../../../apis/anilist/AnilistAPI"));
const MangaInteractionController_1 = __importDefault(require("./MangaInteractionController"));
class MangaCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
        this.query = interaction.options.getString('nombre-o-id');
        this.queryIsNumber = Helpers_1.default.isNumber(this.query);
    }
    async execute() {
        await this.interaction.deferReply();
        this.queryIsNumber ?
            await this.findMangaById() :
            await this.findMangaByName();
    }
    async findMangaById() {
        const mangaId = parseInt(this.query);
        if (mangaId < 0 || mangaId > CommandInteraction_1.default.NUMERO_MAXIMO_32_BITS) {
            throw new IllegalArgumentException_1.default('La ID que has ingresado no es válida.');
        }
        const manga = await AnilistAPI_1.default.fetchMangaById(mangaId);
        const controller = new MangaInteractionController_1.default(this.interaction, [manga]);
        await controller.execute();
    }
    async findMangaByName() {
        const mangas = await AnilistAPI_1.default.fetchMangaByName(this.query);
        const controller = new MangaInteractionController_1.default(this.interaction, mangas);
        await controller.execute();
    }
}
exports.default = MangaCommandInteraction;
