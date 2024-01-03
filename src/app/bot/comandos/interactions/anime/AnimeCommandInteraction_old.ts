import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, CacheType, ChatInputCommandInteraction, Embed, UserSelectMenuBuilder } from "discord.js";
import AnilistAPI from "../../../apis/anilist/AnilistAPI";
import Anime from "../../../apis/anilist/modelos/media/Anime";
import Notas from "../../../apis/anilist/modelos/media/Notas";
import Boton from "../../components/Boton";
import InteraccionComando from "../../modulos/InteraccionComando";
import * as Tipos from '../../../apis/anilist/TiposAnilist';
import Bot from "../../../Bot";
import EmbedAnime from "../../../embeds/EmbedAnime";
import Helpers from "../../../Helpers";
import ErrorArgumentoInvalido from "../../../../errores/ErrorArgumentoInvalido";
import EmbedNotas from "../../../embeds/EmbedNotas";
import { MediaList } from "../../../apis/anilist/tipos/MediaList";

export default class AnimeCommandInteraction extends InteraccionComando {
    protected readonly interaction: ChatInputCommandInteraction<CacheType>;

    private bot: Bot;
    private serverId: string;
    private query: string;

    private isQueryId: boolean;
    private translateInformation: boolean;

    private interactionIndex: number;
    private lastInteractionIndex: number;

    private animes: Array<Anime>;
    private embeds: Array<EmbedAnime>;

    private botonPaginaPrevia = Boton.CreatePrevious();
    private botonPaginaSiguiente = Boton.CreateNext();

    private row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(this.botonPaginaPrevia, this.botonPaginaSiguiente);

    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();

        this.interaction = interaction;

        this.bot = this.interaction.client as Bot;
        this.serverId = this.interaction.guild?.id as string;
        this.query = this.interaction.options.getString('nombre-o-id') as string;
        
        this.isQueryId = Helpers.esNumero(this.query);
        this.translateInformation = this.interaction.options.getBoolean('traducir') || false;

        this.interactionIndex = 0;
        this.lastInteractionIndex = 0;

        this.animes = new Array<Anime>();
        this.embeds = new Array<EmbedAnime>();
    }

    public async execute () {
        await this.interaction.deferReply();

        this.isQueryId ? 
            await this.buscarAnimePorID() :
            await this.buscarAnimePorNombre();            
    }

    private async buscarAnimePorID () {
        const animeID = parseInt(this.query);
        
        if (animeID < 0 || animeID > InteraccionComando.NUMERO_MAXIMO_32_BITS) {
            throw new ErrorArgumentoInvalido('La ID que has ingresado no es valida.');
        }
        
        const resultado: Tipos.Media = await AnilistAPI.buscarAnimePorID(animeID);
        
        const anime: Anime = new Anime(resultado);
        const embedAnime = this.translateInformation ? await EmbedAnime.CrearTraducido(anime) : EmbedAnime.Crear(anime);

        const notas = await this.obtenerNotasUsuarios(parseInt(this.query));
        const embedNotas = EmbedNotas.Crear(notas, anime);

        try {
            notas.hayNotas() ?
                await this.interaction.editReply({ embeds: [embedAnime, embedNotas] }) : 
                await this.interaction.editReply( {embeds: [embedAnime] });
        } catch (error) {
            await this.interaction.editReply({ embeds: [embedAnime] });
            console.error(error);
        }
    }

    private async buscarAnimePorNombre () {
        this.animes = await this.obtenerResultados(this.query);
        this.embeds = await this.obtenerEmbeds(this.animes);

        this.interactionIndex = 0;
        this.lastInteractionIndex = this.embeds.length - 1;

        const anime = this.animes[this.interactionIndex];
        const notas = await this.obtenerNotasUsuarios(anime.obtenerID());

        const embedAnime = this.embeds[this.interactionIndex];
        const embedNotas = EmbedNotas.Crear(notas, anime);

        const embeds = notas.hayNotas() ?
            [embedAnime, embedNotas] : [embedAnime];

        const respuesta = await this.interaction.editReply({
            embeds: embeds,
            components: [this.row]
        })

        try {
            const collector = respuesta.createMessageComponentCollector({
                time: InteraccionComando.TIEMPO_ESPERA_INTERACCION
            });
            
            collector.on('collect', async (boton: ButtonInteraction) => {
                await boton.deferUpdate();

                if (boton.customId === Boton.PreviousButtonID) {
                    this.interactionIndex--;
                    if (this.interactionIndex < 0) this.interactionIndex = this.lastInteractionIndex;  
                }

                if (boton.customId === Boton.NextButtonID) {
                    this.interactionIndex++;
                    if (this.interactionIndex > this.lastInteractionIndex) this.interactionIndex = 0;
                }

                await this.actualizarInteraccion(boton);
            })
        } catch (error) {
            await this.interaction.editReply({ components: [] });
            console.error(error);
        }
    }

    private async obtenerResultados (criterio: string) {
        const resultados = await AnilistAPI.buscarAnimePorNombre(criterio);
        return resultados.map(r => new Anime(r));
    }

    private async obtenerEmbeds (animes: Array<Anime>) {
        const embeds = new Array<EmbedAnime>();

        for (const anime of animes) {
            embeds.push(this.translateInformation ? await EmbedAnime.CrearTraducido(anime) : EmbedAnime.Crear(anime));
        }

        return embeds;
    }

    private async actualizarInteraccion (boton: ButtonInteraction) {
        if (this.bot.interacciones.existe(this.interaction.id)) return;
        this.bot.interacciones.agregar(this.interaction.id);

        try {
            const anime = this.animes[this.interactionIndex];
            const notas = await this.obtenerNotasUsuarios(anime.obtenerID());

            if (!notas.hayNotas()) {
                await boton.editReply({ embeds: [this.embeds[this.interactionIndex]], components: [this.row] });
            } else {
                const embedNotas = EmbedNotas.Crear(notas, anime);
                await boton.editReply({ embeds: [this.embeds[this.interactionIndex], embedNotas], components: [this.row] }); 
            }

        } catch (error) {
            if (error instanceof Error) {
                if (error.message.toLowerCase().includes('too many requests')) {
                    await boton.editReply({ embeds: [this.embeds[this.interactionIndex]], components: [] });
                    return;
                }
            }

            await boton.editReply({ embeds: [this.embeds[this.interactionIndex]], components: [this.row] });
            console.error(error);
        }

        this.bot.interacciones.eliminar(this.interaction.id);
    }

    private async obtenerNotasUsuarios (animeID: number): Promise<Notas> {
        let usuarios = this.bot.usuarios.obtenerUsuariosRegistrados(this.serverId);
        usuarios = Helpers.eliminarElementosRepetidos(usuarios);

        let notasUsuarios = await AnilistAPI.buscarEstadoMediaUsuarios(usuarios, animeID);
        notasUsuarios = Helpers.eliminarElementosRepetidos(notasUsuarios);

        let completadas = notasUsuarios.filter(ml => ml.status === 'COMPLETED');
        let progreso = notasUsuarios.filter(ml => ml.status === 'CURRENT');
        let dropeadas = notasUsuarios.filter(ml => ml.status === 'DROPPED');
        let pausadas = notasUsuarios.filter(ml => ml.status === 'PAUSED');
        let planificadas = notasUsuarios.filter(ml => ml.status === 'PLANNING');

        completadas = await this.obtenerNombresDiscord(completadas);
        progreso = await this.obtenerNombresDiscord(progreso);
        dropeadas = await this.obtenerNombresDiscord(dropeadas);
        pausadas = await this.obtenerNombresDiscord(pausadas);
        planificadas = await this.obtenerNombresDiscord(planificadas);

        return new Notas(completadas, progreso, dropeadas, planificadas, pausadas);
    }

    private async obtenerNombresDiscord (notas: MediaList[]): Promise<MediaList[]> {
        let usuarios = this.bot.usuarios.obtenerUsuariosRegistrados(this.serverId);
        usuarios = Helpers.eliminarElementosRepetidos(usuarios);
        const notasConNombres = new Array<MediaList>();

        for (const nota of notas) {
            const usuario = usuarios.find(ur => parseInt(ur.anilistId) === nota.user.id);
            const usuarioDiscord = await this.bot.users.fetch(usuario?.discordId as string);

            notasConNombres.push({
                id: nota.id, 
                mediaId: nota.mediaId,
                progress: nota.progress,
                repeat: nota.repeat,
                score: nota.score,
                status: nota.status,
                user: {
                    id: nota.user.id,
                    name: usuarioDiscord.username
                }
            })
        }

        return notasConNombres;
    }
}