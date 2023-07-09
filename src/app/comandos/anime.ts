import { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle, normalizeArray, User, Guild, GuildMember, UserResolvable, UserMention } from "discord.js";
import { AnimeEntry } from 'anilist-node';
import ErrorSinResultados from "../errores/ErrorSinResultados";
import AnilistAPI from "../apis/AnilistAPI";
import Helpers from "../helpers";
import Anime from "../media/Anime";
import EmbedAnime from "../embeds/EmbedAnime";
import ErrorArgumentoInvalido from "../errores/ErrorArgumentoInvalido";
import Aniuser from "../modelos/Aniuser";
import EmbedNotas from "../embeds/EmbedNotas";
import Notas from "../embeds/tads/Notas";
import Embed from "../embeds/Embed";
import BOT from "../bot";

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

        const serverID: string = interaccion.guild?.id as string;
        const criterio: string = interaccion.options.getString('nombre-o-id') as string;
        const traducir: boolean = interaccion.options.getBoolean("traducir") || false;

        const esID = Helpers.esNumero(criterio);

        if (esID) {
            let resultado: AnimeEntry;
            const animeID = parseInt(criterio);
            if (animeID < 0 || animeID > 2_147_483_647) throw new ErrorArgumentoInvalido('La ID que has ingresado no es valida.');
            resultado = await AnilistAPI.obtenerAnimeID(parseInt(criterio));
            if (!resultado) throw new ErrorSinResultados('No se ha encontrado un anime con ese ID.');
            const anime: Anime = new Anime(resultado);
            const embed = traducir ? await EmbedAnime.CrearTraducido(anime) : EmbedAnime.Crear(anime);
            interaccion.editReply({ embeds: [embed] });
            return;
        } else {
            const resultados = (await AnilistAPI.buscarAnime(criterio)).media;
            if (resultados.length <= 0) throw new ErrorSinResultados('No se han encontrado resultados.');
            const animes = Array<Anime>();
            const embeds = Array<EmbedAnime>();

            for (const resultado of resultados) {
                const anime = new Anime(await AnilistAPI.obtenerAnimeID(resultado.id));
                animes.push(anime);
                embeds.push(traducir ? await EmbedAnime.CrearTraducido(anime) : EmbedAnime.Crear(anime));
            }

            const botonPaginaPrevia = new ButtonBuilder({ 
                type: ComponentType.Button,
                style: ButtonStyle.Primary,
                customId: 'botonPaginaPrevia',
                label: '←',
            })
    
            const botonPaginaSiguiente = new ButtonBuilder({ 
                type: ComponentType.Button,
                style: ButtonStyle.Primary,
                customId: 'botonPaginaSiguiente',
                label: '→',
            })
        
            const botonMostrarNotas = new ButtonBuilder({ 
                type: ComponentType.Button,
                style: ButtonStyle.Primary,
                customId: 'botonMostrarNotas',
                label: 'NOTAS',
            })

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(botonPaginaPrevia, botonMostrarNotas, botonPaginaSiguiente);
    
            let indiceEmbedActual = 0;
            let ultimoIndice = embeds.length - 1;
    
            const respuesta = await interaccion.editReply({
                embeds: [embeds[indiceEmbedActual]],
                components: [row]
            })
    
            try {
                const collector = respuesta.createMessageComponentCollector({ time: 340_000 });
    
                collector.on('collect', async (boton) => {
                    if (boton.customId === 'botonPaginaPrevia') {
                        indiceEmbedActual--;
                        if (indiceEmbedActual < 0) indiceEmbedActual = ultimoIndice;
                        await boton.update({ embeds: [embeds[indiceEmbedActual]], components: [row] });
                    }
        
                    if (boton.customId === 'botonMostrarNotas') {
                        await boton.deferReply();

                        const animeActual = resultados[indiceEmbedActual];

                        const usuariosNotasCompletadas = Array<any>();
                        const usuariosNotasProgreso = Array<any>();
                        const usuariosNotasDropeadas = Array<any>();
                        const usuariosNotasPlanificadas = Array<any>();

                        const bot = interaccion.client as BOT;

                        for (const usuario of bot.getUsuariosRegistrados(serverID)) {
                            type MediaList = {
                                id: number,
                                mediaId: number,
                                status: 'COMPLETED' | 'CURRENT' | 'DROPPED' | 'PLANNING' | 'PAUSED',
                                score: number,
                                progress: number,
                                repeat: number
                            }

                            const estado = (await AnilistAPI.obtenerListaAnimeUsuario(usuario.anilistId, animeActual.id)).MediaList as MediaList;

                            if (!estado) continue;

                            const miembro = await interaccion.client.users.fetch(usuario.discordId);
                            const nombreMiembro = miembro.username;

                            estado.status === 'COMPLETED' ? 
                                usuariosNotasCompletadas.push({
                                    nombre: nombreMiembro,
                                    nota: estado.score
                                }) : null;
                            
                            estado.status === 'CURRENT' ?
                                usuariosNotasProgreso.push({
                                    nombre: nombreMiembro,
                                    nota: estado.score
                                }) : null;

                            estado.status === 'DROPPED' ?
                                usuariosNotasDropeadas.push({
                                    nombre: nombreMiembro,
                                    nota: estado.score
                                }) : null;

                            estado.status === 'PLANNING' ?
                                usuariosNotasPlanificadas.push({
                                    nombre: nombreMiembro,
                                    nota: estado.score
                                }) : null;
                        }

                        if (usuariosNotasCompletadas.length <= 0 && usuariosNotasProgreso.length <= 0 && usuariosNotasDropeadas.length <= 0 && usuariosNotasPlanificadas.length <=0) {
                            await boton.editReply({ embeds: [embeds[indiceEmbedActual], Embed.CrearRojo('No hay notas disponibles.')], components: [row] });
                            return;
                        }

                        const notas: Notas = new Notas(usuariosNotasCompletadas, usuariosNotasProgreso, usuariosNotasDropeadas, usuariosNotasPlanificadas);

                        await boton.editReply({ embeds: [embeds[indiceEmbedActual], EmbedNotas.Crear(notas, animes[indiceEmbedActual].obtenerColor())], components: [row] });
                    }

                    if (boton.customId === 'botonPaginaSiguiente') {
                        indiceEmbedActual++;
                        if (indiceEmbedActual > ultimoIndice) indiceEmbedActual = 0;
                        await boton.update({ embeds: [embeds[indiceEmbedActual]], components: [row] });
                    }
                })
            } catch (error) {
                await interaccion.editReply({ components: [] });
                throw error;
            }

            return;
        }
    }
}