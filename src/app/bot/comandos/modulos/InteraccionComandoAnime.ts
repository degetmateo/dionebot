import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, CacheType, ChatInputCommandInteraction, Embed, UserSelectMenuBuilder } from "discord.js";
import AnilistAPI from "../../apis/AnilistAPI";
import Anime from "../../media/Anime";
import Notas from "../../media/Notas";
import Boton from "../componentes/Boton";
import InteraccionComando from "./InteraccionComando";
import { Media } from "../../apis/anilist/types/Media";
import Bot from "../../Bot";
import EmbedAnime from "../../embeds/EmbedAnime";
import Helpers from "../../../Helpers";
import ErrorArgumentoInvalido from "../../../errores/ErrorArgumentoInvalido";
import EmbedNotas from "../../embeds/EmbedNotas";
import { MediaList } from "../../apis/anilist/types/MediaList";

export default class InteraccionComandoAnime extends InteraccionComando {
    protected interaction: ChatInputCommandInteraction<CacheType>;

    private bot: Bot;
    private idServidor: string;
    private criterioBusqueda: string;
    private criterioEsID: boolean;
    private traducirInformacion: boolean;

    private indiceInteraccion: number;
    private ultimoIndiceInteraccion: number;

    private animes: Array<Anime>;
    private embeds: Array<EmbedAnime>;

    private botonPaginaPrevia = Boton.CrearPrevio();
    private botonPaginaSiguiente = Boton.CrearSiguiente();

    private row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(this.botonPaginaPrevia, this.botonPaginaSiguiente);

    private constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();

        this.interaction = interaction;

        this.bot = this.interaction.client as Bot;
        this.idServidor = this.interaction.guild?.id as string;
        this.criterioBusqueda = this.interaction.options.getString('nombre-o-id') as string;
        this.criterioEsID = Helpers.esNumero(this.criterioBusqueda);
        this.traducirInformacion = this.interaction.options.getBoolean('traducir') || false;

        this.indiceInteraccion = 0;
        this.ultimoIndiceInteraccion = 0;

        this.animes = new Array<Anime>();
        this.embeds = new Array<EmbedAnime>();
    }
    
    public static async execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const modulo = new InteraccionComandoAnime(interaction);
        await modulo.execute();    
    }

    protected async execute () {
        await this.interaction.deferReply();

        this.criterioEsID ? 
            await this.buscarAnimePorID() :
            await this.buscarAnimePorNombre();            
    }

    private async buscarAnimePorID () {
        const animeID = parseInt(this.criterioBusqueda);
        
        if (animeID < 0 || animeID > InteraccionComando.NUMERO_MAXIMO_32_BITS) {
            throw new ErrorArgumentoInvalido('La ID que has ingresado no es valida.');
        }
        
        const resultado: Media = await AnilistAPI.buscarAnimePorID(animeID);
        
        const anime: Anime = new Anime(resultado);
        const embedAnime = this.traducirInformacion ? await EmbedAnime.CrearTraducido(anime) : EmbedAnime.Crear(anime);

        const notas = await this.obtenerNotasUsuarios(parseInt(this.criterioBusqueda));



        const embedNotas = EmbedNotas.Crear(notas, anime);

        try {
            await this.interaction.editReply({ embeds: [embedAnime, embedNotas] }); 
        } catch (error) {
            await this.interaction.editReply({ embeds: [embedAnime] });
            console.error(error);
        }
    }

    private async buscarAnimePorNombre () {
        this.animes = await this.obtenerResultados(this.criterioBusqueda);
        this.embeds = await this.obtenerEmbeds(this.animes);

        this.indiceInteraccion = 0;
        this.ultimoIndiceInteraccion = this.embeds.length - 1;

        const anime = this.animes[this.indiceInteraccion];
        const notas = await this.obtenerNotasUsuarios(anime.obtenerID());

        const embedAnime = this.embeds[this.indiceInteraccion];
        const embedNotas = EmbedNotas.Crear(notas, anime);

        const respuesta = await this.interaction.editReply({
            embeds: [embedAnime, embedNotas],
            components: [this.row]
        })

        try {
            const collector = respuesta.createMessageComponentCollector({
                time: InteraccionComando.TIEMPO_ESPERA_INTERACCION
            });
            
            collector.on('collect', async (boton: ButtonInteraction) => {
                await boton.deferUpdate();

                if (boton.customId === Boton.BotonPrevioID) {
                    this.indiceInteraccion--;
                    if (this.indiceInteraccion < 0) this.indiceInteraccion = this.ultimoIndiceInteraccion;  
                }

                if (boton.customId === Boton.BotonSiguienteID) {
                    this.indiceInteraccion++;
                    if (this.indiceInteraccion > this.ultimoIndiceInteraccion) this.indiceInteraccion = 0;
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
            embeds.push(this.traducirInformacion ? await EmbedAnime.CrearTraducido(anime) : EmbedAnime.Crear(anime));
        }

        return embeds;
    }

    private async actualizarInteraccion (boton: ButtonInteraction) {
        const estaBuscandoNotas = this.bot.interacciones.has(this.interaction.id);
        if (estaBuscandoNotas) return;

        try {
            const anime = this.animes[this.indiceInteraccion];
            const embedNotas = EmbedNotas.Crear(await this.obtenerNotasUsuarios(anime.obtenerID()), anime);
            await boton.editReply({ embeds: [this.embeds[this.indiceInteraccion], embedNotas], components: [this.row] }); 
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.toLowerCase().includes('too many requests')) {
                    await boton.editReply({ embeds: [this.embeds[this.indiceInteraccion]], components: [] });
                    return;
                }
            }

            await boton.editReply({ embeds: [this.embeds[this.indiceInteraccion]], components: [this.row] });
        }

        this.bot.interacciones.delete(this.interaction.id);
    }

    private async obtenerNotasUsuarios (animeID: number): Promise<Notas> {
        let usuarios = this.bot.getUsuariosRegistrados(this.idServidor);
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
        let usuarios = this.bot.getUsuariosRegistrados(this.idServidor);
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