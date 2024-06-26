"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const NoResultsException_1 = __importDefault(require("../../../errors/NoResultsException"));
const Helpers_1 = __importDefault(require("../../Helpers"));
const VisualNovelDatabaseAPI_1 = __importDefault(require("../../apis/vndb/VisualNovelDatabaseAPI"));
const VisualNovel_1 = __importDefault(require("../../apis/vndb/modelos/VisualNovel"));
const EmbedVisualNovel_1 = __importDefault(require("../../embeds/EmbedVisualNovel"));
class VNCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        await this.interaction.deferReply();
        const query = this.interaction.options.getString('nombre-o-id');
        const translate = this.interaction.options.getBoolean('traducir') || false;
        const queryType = Helpers_1.default.isNumber(query) ? 'id' : 'search';
        const result = await VisualNovelDatabaseAPI_1.default.obtenerPrimerResultado(queryType, query);
        if (!result)
            throw new NoResultsException_1.default('No se han encontrado resultados.');
        const vn = new VisualNovel_1.default(result);
        const embed = translate ? await EmbedVisualNovel_1.default.CreateTranslated(vn) : EmbedVisualNovel_1.default.Create(vn);
        try {
            await this.interaction.editReply({ embeds: [embed] });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = VNCommandInteraction;
