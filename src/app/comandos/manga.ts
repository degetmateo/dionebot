import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { MangaEntry } from 'anilist-node';
import ErrorSinResultados from "../errores/ErrorSinResultados";
import Helpers from "../helpers";
import AnilistAPI from "../apis/AnilistAPI";
import ErrorArgumentoInvalido from "../errores/ErrorArgumentoInvalido";
import Manga from "../media/Manga";
import EmbedManga from "../embeds/EmbedManga";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manga')
        .setDescription('Busca un manga en la base de datos de anilist.')
        .addStringOption(opcion =>
            opcion
                .setName('nombre-o-id')
                .setDescription('El nombre o el ID con el que se va a buscar el manga.')
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
        let resultado: MangaEntry;

        if (esID) {
            const mangaID = parseInt(criterio);
            if (mangaID < 0 || mangaID > 2_147_483_647) throw new ErrorArgumentoInvalido('La ID que has ingresado no es valida.');
            resultado = await AnilistAPI.obtenerMangaID(mangaID);
            if (!resultado) throw new ErrorSinResultados('No se ha encontrado un anime con ese ID.');
        } else {
            const primerResultado = (await AnilistAPI.buscarManga(criterio)).media[0];
            if (!primerResultado) throw new ErrorSinResultados('No se han encontrado resultados.');
            resultado = await AnilistAPI.obtenerMangaID(primerResultado.id);
        }

        const manga: Manga = new Manga(resultado);
        const embed = traducir ? await EmbedManga.CrearTraducido(manga) : EmbedManga.Crear(manga);

        interaccion.editReply({ embeds: [embed] });
    }
}