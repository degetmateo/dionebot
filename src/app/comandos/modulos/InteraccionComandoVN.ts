import { ChatInputCommandInteraction, CacheType } from "discord.js";
import InteraccionComando from "./InteraccionComando";
import VisualNovelDatabaseAPI from "../../apis/VisualNovelDatabaseAPI";
import EmbedNovelaVisual from "../../embeds/EmbedNovelaVisual";
import ErrorSinResultados from "../../errores/ErrorSinResultados";
import Helpers from "../../helpers";
import NovelaVisual from "../../media/NovelaVisual";
import { TipoCriterio } from "../../apis/vndb/PeticionNovelaVisual";

export default class InteraccionComandoVN extends InteraccionComando {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    private constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public static async execute (interaction: ChatInputCommandInteraction<CacheType>) {
        const modulo = new InteraccionComandoVN(interaction);
        await modulo.execute(interaction);    
    }
    
    protected async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply();

        const criterio: string = interaction.options.getString('nombre-o-id') as string;
        const traducir: boolean = interaction.options.getBoolean('traducir') || false;
        
        let tipoCriterio: TipoCriterio;
        Helpers.esNumero(criterio) ? tipoCriterio = 'id' : tipoCriterio = 'search';

        const resultado = await VisualNovelDatabaseAPI.obtenerPrimerResultado(tipoCriterio, criterio);
        if (!resultado) throw new ErrorSinResultados('No se han encontrado resultados.');

        const vn = new NovelaVisual(resultado);
        const embed = traducir ? await EmbedNovelaVisual.CrearTraducido(vn) : EmbedNovelaVisual.Crear(vn);

        interaction.editReply({ embeds: [embed] });
    }
}