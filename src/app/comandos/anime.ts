import { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle } from "discord.js";
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
                const collector = respuesta.createMessageComponentCollector({ time: 120_000 });
    
                collector.on('collect', async (boton) => {
                    if (boton.customId === 'botonPaginaPrevia') {
                        indiceEmbedActual--;
                        if (indiceEmbedActual < 0) indiceEmbedActual = ultimoIndice;
                        await boton.update({ embeds: [embeds[indiceEmbedActual]], components: [row] });
                    }
        
                    if (boton.customId === 'botonMostrarNotas') {
                        await boton.deferUpdate();

                        const animeActual = resultados[indiceEmbedActual];
                        const usuariosRegistrados = await Aniuser.find({ serverId: serverID });

                        const usuariosNotasCompletadas = Array<any>();
                        const usuariosNotasProgreso = Array<any>();
                        const usuariosNotasDropeadas = Array<any>();
                        const usuariosNotasPlanificadas = Array<any>();

                        for (const usuario of usuariosRegistrados) {
                            const listasAnimesUsuario = await AnilistAPI.API.lists.anime(parseInt(usuario.anilistId as string));

                            const animesCompletadosUsuario = listasAnimesUsuario.find(L => L.name.toLowerCase() === 'completed');
                            const animesProgresoUsuario = listasAnimesUsuario.find(L => L.name.toLowerCase() === 'progress');
                            const animesDropeadosUsuario = listasAnimesUsuario.find(L => L.name.toLowerCase() === 'dropped');
                            const animesPlanificadosUsuario = listasAnimesUsuario.find(L => L.name.toLowerCase() === 'planned');

                            const animeCompletado = animesCompletadosUsuario?.entries.find(a => a.media.id === animeActual.id);
                            const animeEnProgreso = animesProgresoUsuario?.entries.find(a => a.media.id === animeActual.id);
                            const animeDropeado = animesDropeadosUsuario?.entries.find(a => a.media.id === animeActual.id);
                            const animePlanificado = animesPlanificadosUsuario?.entries.find(a => a.media.id === animeActual.id);

                            animeCompletado ? 
                                usuariosNotasCompletadas.push({
                                    nombre: interaccion.guild?.members.cache.find(m => m.id === usuario.discordId)?.user.username,
                                    nota: animeCompletado.score
                                }) : null;
                            
                            animeEnProgreso ?
                                usuariosNotasProgreso.push({
                                    nombre: interaccion.guild?.members.cache.find(m => m.id === usuario.discordId)?.user.username,
                                    nota: animeEnProgreso.score
                                }) : null;

                            animeDropeado ?
                                usuariosNotasDropeadas.push({
                                    nombre: interaccion.guild?.members.cache.find(m => m.id === usuario.discordId)?.user.username,
                                    nota: animeDropeado.score
                                }) : null;

                            animePlanificado ?
                                usuariosNotasPlanificadas.push({
                                    nombre: interaccion.guild?.members.cache.find(m => m.id === usuario.discordId)?.user.username,
                                    nota: animePlanificado.score
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
            }

            return;
        }
    }
}