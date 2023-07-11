import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, CacheType, ChatInputCommandInteraction, Embed, UserSelectMenuBuilder } from "discord.js";
import Helpers from "../../helpers";
import BOT from "../../bot";
import ErrorArgumentoInvalido from "../../errores/ErrorArgumentoInvalido";
import AnilistAPI from "../../apis/AnilistAPI";
import Anime from "../../media/Anime";
import EmbedAnime from "../../embeds/EmbedAnime";
import { AnimeEntry } from "anilist-node";
import Notas from "../../tads/Notas";
import EmbedNotas from "../../embeds/EmbedNotas";
import Boton from "../componentes/Boton";
import ErrorSinResultados from "../../errores/ErrorSinResultados";
import InteraccionComando from "./InteraccionComando";

export default class InteraccionComandoAnime extends InteraccionComando {
    private bot: BOT;
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
        super(interaction);

        this.bot = this.interaction.client as BOT;
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
        
        if (animeID < 0 || animeID > InteraccionComandoAnime.NUMERO_MAXIMO_32_BITS)
            throw new ErrorArgumentoInvalido('La ID que has ingresado no es valida.');
        
        const resultado: AnimeEntry = await AnilistAPI.obtenerAnimeID(animeID);
        
        const anime: Anime = new Anime(resultado);
        const embedAnime = this.traducirInformacion ? await EmbedAnime.CrearTraducido(anime) : EmbedAnime.Crear(anime);
        const notas = await this.obtenerNotasUsuarios(parseInt(this.criterioBusqueda));
        const embedNotas = EmbedNotas.Crear(notas, anime);
        
        try {
            await this.interaction.editReply({ embeds: [embedAnime, embedNotas] }); 
        } catch (error) {
            await this.interaction.editReply({ embeds: [embedAnime] });
        }
    }

    private async buscarAnimePorNombre () {
        const resultados = (await AnilistAPI.buscarAnime(this.criterioBusqueda)).media;

        if (!resultados || resultados.length <= 0) throw new ErrorSinResultados('No se han encontrado resultados.');

        this.animes = new Array<Anime>();
        this.embeds = new Array<EmbedAnime>();

        for (const resultado of resultados) {
            const anime = new Anime(await AnilistAPI.obtenerAnimeID(resultado.id));
            this.animes.push(anime);
            this.embeds.push(this.traducirInformacion ? await EmbedAnime.CrearTraducido(anime) : EmbedAnime.Crear(anime));
        }

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
        const usuarios = this.bot.getUsuariosRegistrados(this.idServidor);
        const notasUsuarios = await AnilistAPI.obtenerEstadoMediaUsuarios(usuarios, animeID);

        const completadas = notasUsuarios.filter(ml => ml.status === 'COMPLETED');
        const progreso = notasUsuarios.filter(ml => ml.status === 'CURRENT');
        const dropeadas = notasUsuarios.filter(ml => ml.status === 'DROPPED');
        const pausadas = notasUsuarios.filter(ml => ml.status === 'PAUSED');
        const planificadas = notasUsuarios.filter(ml => ml.status === 'PLANNING');

        return new Notas(completadas, progreso, dropeadas, planificadas, pausadas);
    }
}