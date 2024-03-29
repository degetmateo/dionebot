"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VisualNovelDatabaseAPI_1 = __importDefault(require("../../apis/vndb/VisualNovelDatabaseAPI"));
const NovelaVisual_1 = __importDefault(require("../../apis/vndb/modelos/NovelaVisual"));
const Helpers_1 = __importDefault(require("../../Helpers"));
const ErrorSinResultados_1 = __importDefault(require("../../../errores/ErrorSinResultados"));
const EmbedNovelaVisual_1 = __importDefault(require("../../embeds/EmbedNovelaVisual"));
const CommandInteraction_1 = __importDefault(require("../interactions/CommandInteraction"));
class InteraccionComandoVN extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        await this.interaction.deferReply();
        const criterio = this.interaction.options.getString('nombre-o-id');
        const traducir = this.interaction.options.getBoolean('traducir') || false;
        let tipoCriterio;
        Helpers_1.default.isNumber(criterio) ? tipoCriterio = 'id' : tipoCriterio = 'search';
        const resultado = await VisualNovelDatabaseAPI_1.default.obtenerPrimerResultado(tipoCriterio, criterio);
        if (!resultado)
            throw new ErrorSinResultados_1.default('No se han encontrado resultados.');
        const vn = new NovelaVisual_1.default(resultado);
        const embed = traducir ? await EmbedNovelaVisual_1.default.CrearTraducido(vn) : EmbedNovelaVisual_1.default.Crear(vn);
        this.interaction.editReply({ embeds: [embed] });
    }
}
exports.default = InteraccionComandoVN;
