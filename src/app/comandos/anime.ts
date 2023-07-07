import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { AnimeEntry } from 'anilist-node';
import ErrorSinResultados from "../errores/ErrorSinResultados";
import AnilistAPI from "../apis/AnilistAPI";
import Helpers from "../helpers";
import Anime from "../media/Anime";
import EmbedAnime from "../embeds/EmbedAnime";
import ErrorArgumentoInvalido from "../errores/ErrorArgumentoInvalido";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Busca un anime en la base de datos de anilist.')
        .addStringOption(opcion =>
            opcion
                .setName('nombre-o-id')
                .setDescription('El nombre o el ID con el que se va a buscar el anime.')
                .setRequired(true))
        .addBooleanOption(opcion => 
            opcion
                .setName('traducir')
                .setDescription('Si deseas traducir la sinopsis. (Traductor de Google)')),
    
    execute: async (interaccion: ChatInputCommandInteraction) => {
        await interaccion.deferReply();

        const criterio: string = interaccion.options.getString('nombre-o-id') as string;
        const traducir: boolean = interaccion.options.getBoolean("traducir") || false;

        const esID = Helpers.esNumero(criterio);
        let resultado: AnimeEntry;

        if (esID) {
            const animeID = parseInt(criterio);
            if (animeID < 0 || animeID > 2_147_483_647) throw new ErrorArgumentoInvalido('La ID que has ingresado no es valida.');
            resultado = await AnilistAPI.obtenerAnimeID(parseInt(criterio));
            if (!resultado) throw new ErrorSinResultados('No se ha encontrado un anime con ese ID.');
        } else {
            const primerResultado = (await AnilistAPI.buscarAnime(criterio)).media[0];
            if (!primerResultado) throw new ErrorSinResultados('No se han encontrado resultados.');
            resultado = await AnilistAPI.obtenerAnimeID(primerResultado.id);
        }

        const anime: Anime = new Anime(resultado);
        const embed = traducir ? await EmbedAnime.CrearTraducido(anime) : EmbedAnime.Crear(anime);

        interaccion.editReply({ embeds: [embed] });
    }
}