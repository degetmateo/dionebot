import { ChatInputCommandInteraction, CacheType, ActionRowBuilder, ButtonBuilder, ButtonInteraction } from "discord.js";
import InteraccionComando from "./InteraccionComando";
import Manga from "../../media/Manga";
import EmbedManga from "../../embeds/EmbedManga";
import Helpers from "../../helpers";
import Boton from "../componentes/Boton";
import BOT from "../../bot";
import EmbedNotas from "../../embeds/EmbedNotas";
import AnilistAPI from "../../apis/AnilistAPI";
import ErrorSinResultados from "../../errores/ErrorSinResultados";
import ErrorArgumentoInvalido from "../../errores/ErrorArgumentoInvalido";
import Notas from "../../media/Notas";
import { Media } from "../../apis/anilist/types/Media";

export default class InteraccionComandoManga extends InteraccionComando {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    private bot: BOT;
    private idServidor: string;
    private criterioBusqueda: string;
    private criterioEsID: boolean;
    private traducirInformacion: boolean;

    private indiceInteraccion: number;
    private ultimoIndiceInteraccion: number;

    private mangas: Array<Manga>;
    private embeds: Array<EmbedManga>;

    private botonPaginaPrevia = Boton.CrearPrevio();
    private botonPaginaSiguiente = Boton.CrearSiguiente();

    private row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(this.botonPaginaPrevia, this.botonPaginaSiguiente);

    private constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();

        this.interaction = interaction;

        this.bot = this.interaction.client as BOT;
        this.idServidor = this.interaction.guild?.id as string;
        this.criterioBusqueda = this.interaction.options.getString('nombre-o-id') as string;
        this.criterioEsID = Helpers.esNumero(this.criterioBusqueda);
        this.traducirInformacion = this.interaction.options.getBoolean('traducir') || false;

        this.indiceInteraccion = 0;
        this.ultimoIndiceInteraccion = 0;

        this.mangas = new Array<Manga>();
        this.embeds = new Array<EmbedManga>();
    }
    
    public static async execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const modulo = new InteraccionComandoManga(interaction);
        await modulo.execute();    
    }

    protected async execute () {
        await this.interaction.deferReply();

        this.criterioEsID ? 
            await this.buscarMangaPorID() :
            await this.buscarMangaPorNombre();            
    }

    private async buscarMangaPorID () {
        const mangaID = parseInt(this.criterioBusqueda);
        
        if (mangaID < 0 || mangaID > InteraccionComando.NUMERO_MAXIMO_32_BITS) {
            throw new ErrorArgumentoInvalido('La ID que has ingresado no es valida.');
        }
        
        const resultado: Media = await AnilistAPI.buscarMangaPorID(mangaID);
        
        const manga: Manga = new Manga(resultado);
        const embedManga = this.traducirInformacion ? await EmbedManga.CrearTraducido(manga) : EmbedManga.Crear(manga);

        const notas = await this.obtenerNotasUsuarios(parseInt(this.criterioBusqueda));
        const embedNotas = EmbedNotas.Crear(notas, manga);
        
        try {
            await this.interaction.editReply({ embeds: [embedManga, embedNotas] }); 
        } catch (error) {
            await this.interaction.editReply({ embeds: [embedManga] });
            console.error(error);
        }
    }

    private async buscarMangaPorNombre () {
        const resultados = await AnilistAPI.buscarMangaPorNombre(this.criterioBusqueda);

        if (!resultados || resultados.length <= 0) throw new ErrorSinResultados('No se han encontrado resultados.');

        this.mangas = new Array<Manga>();
        this.embeds = new Array<EmbedManga>();

        for (const resultado of resultados) {
            const manga = new Manga(resultado);
            this.mangas.push(manga);
            this.embeds.push(this.traducirInformacion ? await EmbedManga.CrearTraducido(manga) : EmbedManga.Crear(manga));
        }

        this.indiceInteraccion = 0;
        this.ultimoIndiceInteraccion = this.embeds.length - 1;

        const manga = this.mangas[this.indiceInteraccion];
        const notas = await this.obtenerNotasUsuarios(manga.obtenerID());

        const embedmanga = this.embeds[this.indiceInteraccion];
        const embedNotas = EmbedNotas.Crear(notas, manga);

        const respuesta = await this.interaction.editReply({
            embeds: [embedmanga, embedNotas],
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
            const manga = this.mangas[this.indiceInteraccion];
            const embedNotas = EmbedNotas.Crear(await this.obtenerNotasUsuarios(manga.obtenerID()), manga);
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

    private async obtenerNotasUsuarios (mangaID: number): Promise<Notas> {
        const usuarios = this.bot.getUsuariosRegistrados(this.idServidor);
        const notasUsuarios = await AnilistAPI.buscarEstadoMediaUsuarios(usuarios, mangaID);

        const completadas = notasUsuarios.filter(ml => ml.status === 'COMPLETED');
        const progreso = notasUsuarios.filter(ml => ml.status === 'CURRENT');
        const dropeadas = notasUsuarios.filter(ml => ml.status === 'DROPPED');
        const pausadas = notasUsuarios.filter(ml => ml.status === 'PAUSED');
        const planificadas = notasUsuarios.filter(ml => ml.status === 'PLANNING');

        return new Notas(completadas, progreso, dropeadas, planificadas, pausadas);
    }
}