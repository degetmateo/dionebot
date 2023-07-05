import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { esNumero } from "../helpers";
import NovelaVisual from "../media/NovelaVisual";
import EmbedNovelaVisual from "../embeds/EmbedNovelaVisual";
import { TipoCriterio } from "../tipos/PeticionNovelaVisual";
import VisualNovelDatabaseAPI from "../apis/VisualNovelDatabaseAPI";
import EmbedError from "../embeds/Embed";
import SinResultadosError from "../errores/ErrorSinResultados";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vn')
        .setDescription('Obtén información acerca de una novela visual.')
        .addStringOption(opcion =>
            opcion
                .setName('nombre-o-id')
                .setDescription('El nombre o el ID con el que se va a buscar la novela visual.')
                .setRequired(true))
        .addBooleanOption(opcion =>
            opcion
                .setName('traducir')
                .setDescription('Indicar si la información obtenida debe traducirse al español.')),

    execute: async (interaccion: ChatInputCommandInteraction): Promise<void> => {
        await interaccion.deferReply();

        const criterio: string = interaccion.options.getString('nombre-o-id') as string;
        const traducir: boolean = interaccion.options.getBoolean('traducir') || false;
        
        let tipoCriterio: TipoCriterio;
        esNumero(criterio) ? tipoCriterio = 'id' : tipoCriterio = 'search';

        const resultado = await VisualNovelDatabaseAPI.FetchNovelaVisual(tipoCriterio, criterio);
        if (!resultado) throw new SinResultadosError('No se han encontrado resultados.');

        const vn = new NovelaVisual(resultado);
        const embed = traducir ? await EmbedNovelaVisual.CrearTraducido(vn) : EmbedNovelaVisual.Crear(vn);

        interaccion.editReply({ embeds: [embed] });
    }
}