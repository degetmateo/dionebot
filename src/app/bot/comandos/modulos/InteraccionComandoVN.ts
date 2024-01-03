import { ChatInputCommandInteraction, CacheType } from "discord.js";
import VisualNovelDatabaseAPI from "../../apis/vndb/VisualNovelDatabaseAPI";
import NovelaVisual from "../../apis/vndb/modelos/NovelaVisual";
import { TipoCriterio } from "../../apis/vndb/tipos/PeticionNovelaVisual";
import Helpers from "../../Helpers";
import ErrorSinResultados from "../../../errores/ErrorSinResultados";
import EmbedNovelaVisual from "../../embeds/EmbedNovelaVisual";
import CommandInteraction from "../interactions/CommandInteraction";

export default class InteraccionComandoVN extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }
    
    public async execute(): Promise<void> {
        await this.interaction.deferReply();

        const criterio: string = this.interaction.options.getString('nombre-o-id') as string;
        const traducir: boolean = this.interaction.options.getBoolean('traducir') || false;
        
        let tipoCriterio: TipoCriterio;
        Helpers.isNumber(criterio) ? tipoCriterio = 'id' : tipoCriterio = 'search';

        const resultado = await VisualNovelDatabaseAPI.obtenerPrimerResultado(tipoCriterio, criterio);
        if (!resultado) throw new ErrorSinResultados('No se han encontrado resultados.');

        const vn = new NovelaVisual(resultado);
        const embed = traducir ? await EmbedNovelaVisual.CrearTraducido(vn) : EmbedNovelaVisual.Crear(vn);

        this.interaction.editReply({ embeds: [embed] });
    }
}